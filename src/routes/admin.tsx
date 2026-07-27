import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  LogOut,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  Plus,
  Trash2,
  Upload,
  Lock,
  Settings as SettingsIcon,
  Globe,
} from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import {
  adminIsUnlocked,
  adminUnlock,
  adminLogout,
  adminChangePassword,
  listEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  listAlbums,
  upsertAlbum,
  deleteAlbum,
  listAlbumImages,
  addAlbumImage,
  deleteAlbumImage,
  createMediaUploadUrl,
  getMediaSignedUrl,
  listPosts,
  upsertPost,
  deletePost,
  updateAdminSiteSettings,
} from "@/lib/admin.functions";
import { useSiteContent, type SiteSettings } from "@/hooks/useSiteContent";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Studio Admin — Kamal Studios" }, { name: "robots", content: "noindex" }],
  }),
  component: Admin,
});

type Tab = "overview" | "enquiries" | "portfolio" | "blog" | "content" | "settings";


function Admin() {
  const check = useServerFn(adminIsUnlocked);
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    check()
      .then((r) => {
        setUnlocked(r?.unlocked ?? false);
        setReady(true);
      })
      .catch((err) => {
        console.error("Failed to check admin status:", err);
        setUnlocked(false);
        setReady(true);
      });
  }, [check]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      {unlocked ? <Dashboard onLock={() => setUnlocked(false)} /> : <PasswordGate onUnlocked={() => setUnlocked(true)} />}
      <SiteFooter />
    </div>
  );
}

/* ─────────── Password gate ─────────── */

function PasswordGate({ onUnlocked }: { onUnlocked: () => void }) {
  const unlock = useServerFn(adminUnlock);
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const r = await unlock({ data: { password: pw } });
    setBusy(false);
    if (r.ok) onUnlocked();
    else setErr("Incorrect password.");
  };

  return (
    <section className="pt-40 pb-32 container-lux flex justify-center">
      <form onSubmit={submit} className="w-full max-w-sm border border-border p-10 bg-card">
        <Lock className="size-6 text-[color:var(--gold)]" />
        <h1 className="mt-4 font-display text-3xl">Studio Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter the studio password.</p>
        <input
          type="password"
          autoFocus
          required
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="mt-8 w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-[color:var(--gold)]"
        />
        {err && <div className="mt-3 text-xs text-destructive">{err}</div>}
        <button
          type="submit"
          disabled={busy}
          className="mt-8 w-full bg-foreground text-background py-3 text-xs uppercase tracking-[0.24em] hover:bg-[color:var(--gold)] hover:text-black transition-colors disabled:opacity-50"
        >
          {busy ? "Please wait…" : "Enter dashboard"}
        </button>
      </form>
    </section>
  );
}

/* ─────────── Dashboard shell ─────────── */

function Dashboard({ onLock }: { onLock: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");
  const logout = useServerFn(adminLogout);

  return (
    <section className="pt-36 pb-24 container-lux">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="kbd-eyebrow text-[color:var(--gold)]">Dashboard</div>
          <h1 className="mt-3 font-display text-5xl">Studio Admin</h1>
        </div>
        <button
          onClick={async () => {
            await logout();
            onLock();
          }}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-[color:var(--gold)]"
        >
          <LogOut className="size-4" /> Lock
        </button>
      </div>

      <div className="mt-10 flex flex-wrap gap-2 border-b border-border">
        {(
          [
            ["overview", "Overview"],
            ["enquiries", "Enquiries"],
            ["portfolio", "Portfolio"],
            ["blog", "Blog"],
            ["content", "Content"],
            ["settings", "Settings"],
          ] as [Tab, string][]
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-3 text-xs uppercase tracking-[0.22em] border-b-2 -mb-px transition-colors ${
              tab === k
                ? "border-[color:var(--gold)] text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {tab === "overview" && <Overview onGo={setTab} />}
        {tab === "enquiries" && <EnquiriesPanel />}
        {tab === "portfolio" && <PortfolioPanel />}
        {tab === "blog" && <BlogPanel />}
        {tab === "content" && <ContentPanel />}
        {tab === "settings" && <SettingsPanel />}
      </div>
    </section>
  );
}

function Overview({ onGo }: { onGo: (t: Tab) => void }) {
  const [counts, setCounts] = useState({ enquiries: 0, albums: 0, posts: 0 });
  const enq = useServerFn(listEnquiries);
  const alb = useServerFn(listAlbums);
  const pos = useServerFn(listPosts);
  useEffect(() => {
    Promise.all([enq(), alb(), pos()]).then(([a, b, c]) =>
      setCounts({ enquiries: a.length, albums: b.length, posts: c.length }),
    );
  }, [enq, alb, pos]);
  const cards = [
    [MessageSquare, "Enquiries", counts.enquiries, "enquiries" as Tab],
    [ImageIcon, "Portfolio albums", counts.albums, "portfolio" as Tab],
    [FileText, "Blog posts", counts.posts, "blog" as Tab],
    [Globe, "Website content", "Control", "content" as Tab],
  ] as const;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(([Icon, title, n, t]) => (
        <button
          key={title}
          onClick={() => onGo(t)}
          className="text-left border border-border p-8 bg-card hover:border-[color:var(--gold)] transition-colors"
        >
          <Icon className="size-5 text-[color:var(--gold)]" />
          <div className="mt-4 font-display text-4xl">{n}</div>
          <div className="text-sm text-muted-foreground mt-1">{title}</div>
        </button>
      ))}
    </div>
  );
}

/* ─────────── Enquiries ─────────── */

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  event_date: string | null;
  message: string;
  status: string;
  created_at: string;
};

function EnquiriesPanel() {
  const list = useServerFn(listEnquiries);
  const setStatusFn = useServerFn(updateEnquiryStatus);
  const removeFn = useServerFn(deleteEnquiry);
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await list();
    setRows(data as Enquiry[]);
    setLoading(false);
  }, [list]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: string) => {
    await setStatusFn({ data: { id, status } });
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    await removeFn({ data: { id } });
    load();
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (!rows.length) return <Empty label="No enquiries yet." />;

  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div key={r.id} className="border border-border p-6 bg-card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-display text-xl">{r.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(r.created_at).toLocaleString()} · {r.service ?? "—"}
                {r.event_date ? ` · ${r.event_date}` : ""}
              </div>
              <div className="mt-3 text-sm">
                <a className="hover-gold" href={`mailto:${r.email}`}>{r.email}</a>
                {r.phone && <> · <a className="hover-gold" href={`tel:${r.phone}`}>{r.phone}</a></>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={r.status}
                onChange={(e) => setStatus(r.id, e.target.value)}
                className="bg-transparent border border-border px-3 py-1.5 text-xs uppercase tracking-[0.2em]"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
              <button onClick={() => remove(r.id)} className="p-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground whitespace-pre-wrap">{r.message}</p>
        </div>
      ))}
    </div>
  );
}

/* ─────────── Media upload helper ─────────── */

function useMediaUpload() {
  const create = useServerFn(createMediaUploadUrl);
  const getUrl = useServerFn(getMediaSignedUrl);
  return async (file: File): Promise<string> => {
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const c = await create({ data: { ext } });
    if (!c.ok) throw new Error(c.error);
    if ((c as any).isMock) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
    const putRes = await fetch(c.signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!putRes.ok) throw new Error(`Upload failed: ${putRes.status}`);
    const s = await getUrl({ data: { path: c.path } });
    if (!s.ok) throw new Error(s.error);
    return s.url;
  };
}

/* ─────────── Portfolio ─────────── */

type Album = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string | null;
  cover_url: string | null;
  published: boolean;
  sort_order: number;
};
type PortfolioImage = { id: string; album_id: string; url: string; caption: string | null; sort_order: number };

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function PortfolioPanel() {
  const list = useServerFn(listAlbums);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [editing, setEditing] = useState<Album | null>(null);

  const load = useCallback(async () => {
    setAlbums((await list()) as Album[]);
  }, [list]);
  useEffect(() => {
    load();
  }, [load]);

  if (editing)
    return (
      <AlbumEditor
        album={editing}
        onClose={() => {
          setEditing(null);
          load();
        }}
      />
    );

  const newAlbum = () =>
    setEditing({
      id: "",
      slug: "",
      title: "",
      category: "Weddings",
      description: "",
      cover_url: "",
      published: false,
      sort_order: 0,
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">{albums.length} albums</div>
        <button
          onClick={newAlbum}
          className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs uppercase tracking-[0.22em] hover:bg-[color:var(--gold)] hover:text-black transition-colors"
        >
          <Plus className="size-4" /> New album
        </button>
      </div>
      {!albums.length && <Empty label="No albums yet. Create your first." />}
      <div className="grid gap-4 md:grid-cols-2">
        {albums.map((a) => (
          <button
            key={a.id}
            onClick={() => setEditing(a)}
            className="text-left border border-border bg-card hover:border-[color:var(--gold)] transition-colors flex gap-4 p-4"
          >
            <div className="w-28 h-28 bg-black flex-shrink-0 overflow-hidden">
              {a.cover_url ? (
                <img src={a.cover_url} alt={a.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  No cover
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg truncate">{a.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {a.category} · /{a.slug}
              </div>
              <div
                className={`mt-2 inline-block text-[10px] uppercase tracking-[0.22em] px-2 py-0.5 border ${
                  a.published
                    ? "border-[color:var(--gold)] text-[color:var(--gold)]"
                    : "border-border text-muted-foreground"
                }`}
              >
                {a.published ? "Published" : "Draft"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AlbumEditor({ album, onClose }: { album: Album; onClose: () => void }) {
  const saveFn = useServerFn(upsertAlbum);
  const removeFn = useServerFn(deleteAlbum);
  const listImg = useServerFn(listAlbumImages);
  const addImg = useServerFn(addAlbumImage);
  const removeImg = useServerFn(deleteAlbumImage);
  const upload = useMediaUpload();

  const [a, setA] = useState<Album>(album);
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isNew = !a.id;

  const loadImages = useCallback(async () => {
    if (!a.id) return;
    setImages((await listImg({ data: { albumId: a.id } })) as PortfolioImage[]);
  }, [a.id, listImg]);
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const save = async () => {
    setSaving(true);
    const slug = a.slug || slugify(a.title);
    const r = await saveFn({
      data: {
        id: a.id || undefined,
        slug,
        title: a.title,
        category: a.category,
        description: a.description,
        cover_url: a.cover_url,
        published: a.published,
        sort_order: a.sort_order,
      },
    });
    setSaving(false);
    if (!r.ok) return alert(r.error);
    if (isNew) setA({ ...a, id: r.id, slug });
  };

  const remove = async () => {
    if (!confirm("Delete this album and its images?")) return;
    await removeFn({ data: { id: a.id } });
    onClose();
  };

  const uploadCover = async (file: File) => {
    setUploading(true);
    try {
      const url = await upload(file);
      setA({ ...a, cover_url: url });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    }
    setUploading(false);
  };

  const addImages = async (files: FileList | null) => {
    if (!files || !a.id) return;
    setUploading(true);
    try {
      let i = images.length;
      for (const f of Array.from(files)) {
        const url = await upload(f);
        await addImg({ data: { albumId: a.id, url, sortOrder: i++ } });
      }
      loadImages();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    }
    setUploading(false);
  };

  const removeImage = async (id: string) => {
    await removeImg({ data: { id } });
    loadImages();
  };

  return (
    <div>
      <button
        onClick={onClose}
        className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-[color:var(--gold)] mb-6"
      >
        ← Back to albums
      </button>
      <div className="grid gap-6 md:grid-cols-2">
        <Input label="Title" value={a.title} onChange={(v) => setA({ ...a, title: v })} />
        <Input
          label="Slug (URL)"
          value={a.slug}
          placeholder={slugify(a.title)}
          onChange={(v) => setA({ ...a, slug: v })}
        />
        <div className="flex flex-col gap-2">
          <label className="kbd-eyebrow text-muted-foreground">Category</label>
          <select
            value={a.category}
            onChange={(e) => setA({ ...a, category: e.target.value })}
            className="bg-transparent border-b border-border py-3"
          >
            {["Weddings", "Portraits", "Baby", "Family", "Fashion", "Commercial", "Corporate", "Events", "Videography"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <Input
          label="Sort order"
          type="number"
          value={String(a.sort_order)}
          onChange={(v) => setA({ ...a, sort_order: Number(v) || 0 })}
        />
        <div className="md:col-span-2">
          <label className="kbd-eyebrow text-muted-foreground">Description</label>
          <textarea
            value={a.description ?? ""}
            onChange={(e) => setA({ ...a, description: e.target.value })}
            rows={3}
            className="mt-2 w-full bg-transparent border-b border-border py-3"
          />
        </div>
        <div className="md:col-span-2">
          <label className="kbd-eyebrow text-muted-foreground">Cover image</label>
          <div className="mt-3 flex items-center gap-4">
            {a.cover_url && <img src={a.cover_url} alt="" className="w-32 h-32 object-cover bg-black" />}
            <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-[color:var(--gold)] cursor-pointer">
              <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
              />
            </label>
          </div>
        </div>
        <label className="md:col-span-2 flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={a.published}
            onChange={(e) => setA({ ...a, published: e.target.checked })}
          />
          Published
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.22em] hover:bg-[color:var(--gold)] hover:text-black transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : isNew ? "Create album" : "Save"}
        </button>
        {!isNew && (
          <button
            onClick={remove}
            className="border border-destructive text-destructive px-6 py-3 text-xs uppercase tracking-[0.22em] hover:bg-destructive hover:text-white transition-colors"
          >
            Delete
          </button>
        )}
      </div>

      {!isNew && (
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display text-2xl">Gallery ({images.length})</div>
            <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-[color:var(--gold)] cursor-pointer">
              <Upload className="size-4" /> {uploading ? "Uploading…" : "Add images"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addImages(e.target.files)}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((im) => (
              <div key={im.id} className="relative group aspect-square bg-black">
                <img src={im.url} alt={im.caption ?? ""} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(im.id)}
                  className="absolute top-2 right-2 bg-black/70 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────── Blog ─────────── */

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  content: string;
  category: string | null;
  author: string | null;
  published: boolean;
  published_at: string | null;
};

function BlogPanel() {
  const list = useServerFn(listPosts);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);

  const load = useCallback(async () => {
    setPosts((await list()) as Post[]);
  }, [list]);
  useEffect(() => {
    load();
  }, [load]);

  if (editing)
    return (
      <PostEditor
        post={editing}
        onClose={() => {
          setEditing(null);
          load();
        }}
      />
    );

  const newPost = () =>
    setEditing({
      id: "",
      slug: "",
      title: "",
      excerpt: "",
      cover_url: "",
      content: "",
      category: "Craft",
      author: "Kamal Studios",
      published: false,
      published_at: null,
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">{posts.length} posts</div>
        <button
          onClick={newPost}
          className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 text-xs uppercase tracking-[0.22em] hover:bg-[color:var(--gold)] hover:text-black transition-colors"
        >
          <Plus className="size-4" /> New post
        </button>
      </div>
      {!posts.length && <Empty label="No posts yet. Write your first." />}
      <div className="space-y-3">
        {posts.map((p) => (
          <button
            key={p.id}
            onClick={() => setEditing(p)}
            className="w-full text-left border border-border bg-card hover:border-[color:var(--gold)] p-4 flex gap-4 transition-colors"
          >
            <div className="w-24 h-24 bg-black flex-shrink-0 overflow-hidden">
              {p.cover_url && <img src={p.cover_url} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-lg truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{p.category} · /{p.slug}</div>
              <div
                className={`mt-2 inline-block text-[10px] uppercase tracking-[0.22em] px-2 py-0.5 border ${
                  p.published
                    ? "border-[color:var(--gold)] text-[color:var(--gold)]"
                    : "border-border text-muted-foreground"
                }`}
              >
                {p.published ? "Published" : "Draft"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PostEditor({ post, onClose }: { post: Post; onClose: () => void }) {
  const saveFn = useServerFn(upsertPost);
  const removeFn = useServerFn(deletePost);
  const upload = useMediaUpload();
  const [p, setP] = useState<Post>(post);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isNew = !p.id;

  const save = async () => {
    setSaving(true);
    const slug = p.slug || slugify(p.title);
    const r = await saveFn({
      data: {
        id: p.id || undefined,
        slug,
        title: p.title,
        excerpt: p.excerpt,
        cover_url: p.cover_url,
        content: p.content,
        category: p.category,
        author: p.author,
        published: p.published,
        published_at: p.published_at,
      },
    });
    setSaving(false);
    if (!r.ok) return alert(r.error);
    if (isNew) onClose();
  };

  const remove = async () => {
    if (!confirm("Delete this post?")) return;
    await removeFn({ data: { id: p.id } });
    onClose();
  };

  const uploadCover = async (file: File) => {
    setUploading(true);
    try {
      const url = await upload(file);
      setP({ ...p, cover_url: url });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    }
    setUploading(false);
  };

  return (
    <div>
      <button
        onClick={onClose}
        className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-[color:var(--gold)] mb-6"
      >
        ← Back to posts
      </button>
      <div className="grid gap-6 md:grid-cols-2">
        <Input label="Title" value={p.title} onChange={(v) => setP({ ...p, title: v })} />
        <Input label="Slug" value={p.slug} placeholder={slugify(p.title)} onChange={(v) => setP({ ...p, slug: v })} />
        <Input label="Category" value={p.category ?? ""} onChange={(v) => setP({ ...p, category: v })} />
        <Input label="Author" value={p.author ?? ""} onChange={(v) => setP({ ...p, author: v })} />
        <div className="md:col-span-2">
          <label className="kbd-eyebrow text-muted-foreground">Excerpt</label>
          <textarea
            value={p.excerpt ?? ""}
            onChange={(e) => setP({ ...p, excerpt: e.target.value })}
            rows={2}
            className="mt-2 w-full bg-transparent border-b border-border py-3"
          />
        </div>
        <div className="md:col-span-2">
          <label className="kbd-eyebrow text-muted-foreground">Cover image</label>
          <div className="mt-3 flex items-center gap-4">
            {p.cover_url && <img src={p.cover_url} alt="" className="w-32 h-32 object-cover bg-black" />}
            <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-[color:var(--gold)] cursor-pointer">
              <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
              />
            </label>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="kbd-eyebrow text-muted-foreground">Content (Markdown supported)</label>
          <textarea
            value={p.content}
            onChange={(e) => setP({ ...p, content: e.target.value })}
            rows={18}
            className="mt-2 w-full bg-transparent border border-border p-4 font-mono text-sm"
          />
        </div>
        <label className="md:col-span-2 flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={p.published}
            onChange={(e) => setP({ ...p, published: e.target.checked })}
          />
          Published
        </label>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.22em] hover:bg-[color:var(--gold)] hover:text-black transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : isNew ? "Create post" : "Save"}
        </button>
        {!isNew && (
          <button
            onClick={remove}
            className="border border-destructive text-destructive px-6 py-3 text-xs uppercase tracking-[0.22em] hover:bg-destructive hover:text-white transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────── Settings ─────────── */

function SettingsPanel() {
  const change = useServerFn(adminChangePassword);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (next !== confirmPw) return setMsg({ ok: false, text: "New passwords do not match." });
    setBusy(true);
    const r = await change({ data: { current, next } });
    setBusy(false);
    if (r.ok) {
      setMsg({ ok: true, text: "Password updated." });
      setCurrent("");
      setNext("");
      setConfirmPw("");
    } else {
      setMsg({ ok: false, text: r.error ?? "Failed to update." });
    }
  };

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-2 kbd-eyebrow text-[color:var(--gold)]">
        <SettingsIcon className="size-4" /> Change password
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        The studio password unlocks this dashboard. Keep it private.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          type="password"
          required
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder="Current password"
          className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-[color:var(--gold)]"
        />
        <input
          type="password"
          required
          minLength={6}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          placeholder="New password (min 6 chars)"
          className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-[color:var(--gold)]"
        />
        <input
          type="password"
          required
          minLength={6}
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          placeholder="Confirm new password"
          className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-[color:var(--gold)]"
        />
        {msg && (
          <div className={`text-xs ${msg.ok ? "text-[color:var(--gold)]" : "text-destructive"}`}>{msg.text}</div>
        )}
        <button
          type="submit"
          disabled={busy}
          className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.22em] hover:bg-[color:var(--gold)] hover:text-black transition-colors disabled:opacity-50"
        >
          {busy ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

/* ─────────── Content Panel ─────────── */

function ContentPanel() {
  const { settings, refresh } = useSiteContent();
  const updateSettings = useServerFn(updateAdminSiteSettings);
  const upload = useMediaUpload();

  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await upload(file);
      setFormData(prev => ({ ...prev, logoUrl: url }));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Logo upload failed");
    }
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await updateSettings({ data: { settings: formData } });
      if (res.ok) {
        await refresh();
        setMessage({ ok: true, text: "Content settings updated successfully!" });
      } else {
        setMessage({ ok: false, text: res.error || "Failed to update content." });
      }
    } catch (err) {
      setMessage({ ok: false, text: "An error occurred while saving." });
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-12 max-w-4xl">
      {/* Identity */}
      <div className="border border-border p-8 bg-card space-y-6">
        <h2 className="font-display text-2xl border-b border-border pb-3 text-[color:var(--gold)]">Identity & Logo</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Input label="Brand Name" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
          <Input label="Tagline" value={formData.tagline} onChange={v => setFormData({ ...formData, tagline: v })} />
          <Input label="Since (Year)" type="number" value={String(formData.since)} onChange={v => setFormData({ ...formData, since: Number(v) || 1966 })} />
          <Input label="Operating Hours" value={formData.hours} onChange={v => setFormData({ ...formData, hours: v })} />
        </div>
        <div className="space-y-2">
          <label className="kbd-eyebrow text-muted-foreground">Logo Image</label>
          <div className="flex items-center gap-6 mt-2">
            {formData.logoUrl && (
              <img src={formData.logoUrl} alt="Logo Preview" className="h-16 w-auto object-contain bg-black p-2 border border-border" />
            )}
            <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.22em] hover:border-[color:var(--gold)] cursor-pointer">
              <Upload className="size-4" /> {uploading ? "Uploading…" : "Upload Logo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Hero Page Copy */}
      <div className="border border-border p-8 bg-card space-y-6">
        <h2 className="font-display text-2xl border-b border-border pb-3 text-[color:var(--gold)]">Hero Page Copy</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Input label="Title (Part 1)" value={formData.hero.title_part1} onChange={v => setFormData({ ...formData, hero: { ...formData.hero, title_part1: v } })} />
          <Input label="Title (Part 2 - Golden/Italic)" value={formData.hero.title_part2} onChange={v => setFormData({ ...formData, hero: { ...formData.hero, title_part2: v } })} />
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="kbd-eyebrow text-muted-foreground">Hero Subtitle</label>
            <textarea
              value={formData.hero.subtitle}
              onChange={e => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })}
              rows={3}
              className="mt-2 w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-[color:var(--gold)]"
            />
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="border border-border p-8 bg-card space-y-6">
        <h2 className="font-display text-2xl border-b border-border pb-3 text-[color:var(--gold)]">Contact Details</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Input label="Phone Display" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} />
          <Input label="Phone (Raw digits, e.g. +919876543210)" value={formData.phoneRaw} onChange={v => setFormData({ ...formData, phoneRaw: v })} />
          <Input label="WhatsApp link or Raw Phone" value={formData.whatsapp} onChange={v => setFormData({ ...formData, whatsapp: v })} />
          <Input label="Email Address" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
          <div className="md:col-span-2">
            <Input label="Physical Address" value={formData.address} onChange={v => setFormData({ ...formData, address: v })} />
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="border border-border p-8 bg-card space-y-6">
        <h2 className="font-display text-2xl border-b border-border pb-3 text-[color:var(--gold)]">Social Media Links</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Input label="Instagram URL" value={formData.social.instagram} onChange={v => setFormData({ ...formData, social: { ...formData.social, instagram: v } })} />
          <Input label="YouTube Channel URL" value={formData.social.youtube} onChange={v => setFormData({ ...formData, social: { ...formData.social, youtube: v } })} />
          <Input label="Facebook Page URL" value={formData.social.facebook} onChange={v => setFormData({ ...formData, social: { ...formData.social, facebook: v } })} />
          <Input label="Google Maps Review URL" value={formData.social.google} onChange={v => setFormData({ ...formData, social: { ...formData.social, google: v } })} />
        </div>
      </div>

      {/* Statistics */}
      <div className="border border-border p-8 bg-card space-y-6">
        <h2 className="font-display text-2xl border-b border-border pb-3 text-[color:var(--gold)]">Studio Statistics</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Input label="Projects (e.g. 4,800+)" value={formData.stats.projects} onChange={v => setFormData({ ...formData, stats: { ...formData.stats, projects: v } })} />
          <Input label="Clients (e.g. 3,200+)" value={formData.stats.clients} onChange={v => setFormData({ ...formData, stats: { ...formData.stats, clients: v } })} />
          <Input label="Cities (e.g. 60+)" value={formData.stats.cities} onChange={v => setFormData({ ...formData, stats: { ...formData.stats, cities: v } })} />
          <Input label="Google Rating (e.g. 4.9)" type="number" step="0.1" value={String(formData.stats.rating)} onChange={v => setFormData({ ...formData, stats: { ...formData.stats, rating: Number(v) || 4.9 } })} />
          <Input label="Google Reviews Count" type="number" value={String(formData.stats.reviews)} onChange={v => setFormData({ ...formData, stats: { ...formData.stats, reviews: Number(v) || 820 } })} />
        </div>
      </div>

      {message && (
        <div className={`p-4 border ${message.ok ? "border-[color:var(--gold)] text-[color:var(--gold)] bg-card" : "border-destructive text-destructive bg-card"} text-sm`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.24em] hover:bg-[color:var(--gold)] hover:text-black transition-colors disabled:opacity-50 font-medium"
        >
          {saving ? "Saving Changes…" : "Save Website Content"}
        </button>
      </div>
    </form>
  );
}

/* ─────────── Shared ─────────── */

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="kbd-eyebrow text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-b border-border py-3 focus:outline-none focus:border-[color:var(--gold)]"
      />
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="border border-border p-16 text-center text-sm text-muted-foreground bg-secondary/40">
      {label}
    </div>
  );
}
