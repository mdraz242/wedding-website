import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Studio Owner password gate.
 *
 * There is NO user auth, NO signup, NO Google, NO Supabase Auth session.
 * A single shared password unlocks the dashboard. Owner can change it.
 * All CRUD operations below use the service-role client and are gated on
 * an encrypted session cookie set by `adminUnlock`.
 */

type GateSession = { unlocked?: boolean; at?: number };

const sessionConfig = () => ({
  password: process.env.SESSION_SECRET || "fallback-session-secret-key-must-be-at-least-32-characters-long",
  name: "ks-admin",
  maxAge: 60 * 60 * 24 * 14, // 14 days
  cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
});

function sha256(s: string) {
  return createHash("sha256").update(s, "utf8").digest("hex");
}

function safeEq(a: string, b: string) {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

async function requireUnlocked() {
  const session = await useSession<GateSession>(sessionConfig());
  if (!session.data.unlocked) {
    throw new Response("Locked", { status: 401 });
  }
  return session;
}

/* ─────────── Mock Local Storage Fallback ─────────── */

const isMockMode = !process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === "PASTE_YOUR_SERVICE_ROLE_KEY_HERE";

let mockPasswordHash = "bc3cccb57d68a8162178493717eae3ed342d671d6cd67d4efa249e6127381eac"; // kamal1966

let mockEnquiries = [
  {
    id: "enq-1",
    name: "Rohan Mehta",
    email: "rohan@example.com",
    phone: "+91 98765 43210",
    service: "Wedding Photography",
    event_date: "2026-12-15",
    message: "We love your heritage look. Please share packages for Udaipur.",
    status: "new",
    created_at: new Date().toISOString(),
  }
];

let mockAlbums = [
  {
    id: "alb-1",
    slug: "weddings-in-udaipur",
    title: "Regal Udaipur Wedding",
    category: "Weddings",
    description: "A palace wedding captured at the Taj Lake Palace, Udaipur.",
    cover_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    published: true,
    sort_order: 1,
  }
];

let mockAlbumImages = [
  {
    id: "img-1",
    album_id: "alb-1",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    caption: "Udaipur Bride",
    sort_order: 1,
  }
];

let mockPosts = [
  {
    id: "post-1",
    slug: "editorial-wedding-journalism",
    title: "Editorial Wedding Journalism",
    excerpt: "The intersection of heritage documentary work and high fashion.",
    cover_url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    content: "## Behind the lens\n\nExploring new approaches to luxury wedding photography in India...",
    category: "Craft",
    author: "Kamal Studios",
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }
];

let mockSiteSettings: any = null;

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  if (isMockMode) {
    return { settings: mockSiteSettings };
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("site_content")
    .select("value")
    .eq("key", "site_settings")
    .maybeSingle();
  return { settings: data?.value || null };
});

/* ─────────── Gate ─────────── */

export const adminIsUnlocked = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const session = await useSession<GateSession>(sessionConfig());
    return { unlocked: !!session.data.unlocked };
  } catch (error) {
    console.error("adminIsUnlocked session error:", error);
    return { unlocked: false };
  }
});

export const adminUnlock = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    if (isMockMode) {
      if (!safeEq(sha256(data.password), mockPasswordHash)) return { ok: false as const };
    } else {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: row, error } = await supabaseAdmin
        .from("admin_settings")
        .select("password_hash")
        .eq("id", 1)
        .maybeSingle();
      if (error || !row) return { ok: false as const };
      if (!safeEq(sha256(data.password), row.password_hash)) return { ok: false as const };
    }
    const session = await useSession<GateSession>(sessionConfig());
    await session.update({ unlocked: true, at: Date.now() });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminChangePassword = createServerFn({ method: "POST" })
  .inputValidator((data: { current: string; next: string }) => data)
  .handler(async ({ data }) => {
    if (!data.next || data.next.length < 6) {
      return { ok: false as const, error: "New password must be at least 6 characters." };
    }
    await requireUnlocked();
    if (isMockMode) {
      if (!safeEq(sha256(data.current), mockPasswordHash)) {
        return { ok: false as const, error: "Current password is incorrect." };
      }
      mockPasswordHash = sha256(data.next);
      return { ok: true as const };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("admin_settings")
      .select("password_hash")
      .eq("id", 1)
      .maybeSingle();
    if (!row || !safeEq(sha256(data.current), row.password_hash)) {
      return { ok: false as const, error: "Current password is incorrect." };
    }
    const { error } = await supabaseAdmin
      .from("admin_settings")
      .update({ password_hash: sha256(data.next), updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

/* ─────────── Enquiries ─────────── */

export const listEnquiries = createServerFn({ method: "GET" }).handler(async () => {
  await requireUnlocked();
  if (isMockMode) return mockEnquiries;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Response(error.message, { status: 500 });
  return data ?? [];
});

export const updateEnquiryStatus = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; status: string }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      mockEnquiries = mockEnquiries.map((e) =>
        e.id === data.id ? { ...e, status: data.status } : e
      );
      return { ok: true };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("enquiries").update({ status: data.status }).eq("id", data.id);
    return { ok: true };
  });

export const deleteEnquiry = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      mockEnquiries = mockEnquiries.filter((e) => e.id !== data.id);
      return { ok: true };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("enquiries").delete().eq("id", data.id);
    return { ok: true };
  });

/* ─────────── Portfolio ─────────── */

export const listAlbums = createServerFn({ method: "GET" }).handler(async () => {
  await requireUnlocked();
  if (isMockMode) return mockAlbums;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("portfolio_albums")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });
  return data ?? [];
});

type AlbumInput = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  description: string | null;
  cover_url: string | null;
  published: boolean;
  sort_order: number;
};

export const upsertAlbum = createServerFn({ method: "POST" })
  .inputValidator((d: AlbumInput) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      if (data.id) {
        mockAlbums = mockAlbums.map((a) =>
          a.id === data.id ? ({ ...a, ...data } as any) : a
        );
        return { ok: true as const, id: data.id };
      }
      const newId = `alb-${Date.now()}`;
      mockAlbums.push({ ...data, id: newId } as any);
      return { ok: true as const, id: newId };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      const albumId = data.id;
      const { id: _skip, ...upd } = data;
      void _skip;
      const { error } = await supabaseAdmin.from("portfolio_albums").update(upd).eq("id", albumId);
      if (error) return { ok: false as const, error: error.message };
      return { ok: true as const, id: albumId };
    }
    const { id: _skip, ...ins } = data;
    void _skip;
    const { data: created, error } = await supabaseAdmin
      .from("portfolio_albums")
      .insert(ins)
      .select("id")
      .single();
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, id: created.id };
  });

export const deleteAlbum = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      mockAlbums = mockAlbums.filter((a) => a.id !== data.id);
      mockAlbumImages = mockAlbumImages.filter((im) => im.album_id !== data.id);
      return { ok: true };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("portfolio_albums").delete().eq("id", data.id);
    return { ok: true };
  });

export const listAlbumImages = createServerFn({ method: "GET" })
  .inputValidator((d: { albumId: string }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) return mockAlbumImages.filter((im) => im.album_id === data.albumId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("portfolio_images")
      .select("*")
      .eq("album_id", data.albumId)
      .order("sort_order");
    return rows ?? [];
  });

export const addAlbumImage = createServerFn({ method: "POST" })
  .inputValidator((d: { albumId: string; url: string; sortOrder: number }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      mockAlbumImages.push({
        id: `img-${Date.now()}-${Math.random()}`,
        album_id: data.albumId,
        url: data.url,
        caption: null,
        sort_order: data.sortOrder,
      });
      return { ok: true };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("portfolio_images")
      .insert({ album_id: data.albumId, url: data.url, sort_order: data.sortOrder });
    return { ok: true };
  });

export const deleteAlbumImage = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      mockAlbumImages = mockAlbumImages.filter((im) => im.id !== data.id);
      return { ok: true };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("portfolio_images").delete().eq("id", data.id);
    return { ok: true };
  });

/* ─────────── Blog ─────────── */

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  await requireUnlocked();
  if (isMockMode) return mockPosts;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
});

type PostInput = {
  id?: string;
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

export const upsertPost = createServerFn({ method: "POST" })
  .inputValidator((d: PostInput) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      if (data.id) {
        mockPosts = mockPosts.map((p) =>
          p.id === data.id ? ({ ...p, ...data } as any) : p
        );
        return { ok: true as const, id: data.id };
      }
      const newId = `post-${Date.now()}`;
      mockPosts.push({ ...data, id: newId } as any);
      return { ok: true as const, id: newId };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      ...data,
      published_at:
        data.published && !data.published_at ? new Date().toISOString() : data.published_at,
    };
    if (data.id) {
      const postId = data.id;
      const { id: _skip, ...upd } = payload;
      void _skip;
      const { error } = await supabaseAdmin.from("blog_posts").update(upd).eq("id", postId);
      if (error) return { ok: false as const, error: error.message };
      return { ok: true as const, id: postId };
    }
    const { id: _skip, ...ins } = payload;
    void _skip;
    const { data: created, error } = await supabaseAdmin
      .from("blog_posts")
      .insert(ins)
      .select("id")
      .single();
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, id: created.id };
  });

export const deletePost = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      mockPosts = mockPosts.filter((p) => p.id !== data.id);
      return { ok: true };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("blog_posts").delete().eq("id", data.id);
    return { ok: true };
  });

/* ─────────── Media uploads (signed upload URL + signed read URL) ─────────── */

export const createMediaUploadUrl = createServerFn({ method: "POST" })
  .inputValidator((d: { ext: string }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      return { ok: true as const, path: "", token: "", signedUrl: "", isMock: true };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const path = `${crypto.randomUUID()}.${(data.ext || "jpg").replace(/[^a-z0-9]/gi, "").slice(0, 5) || "jpg"}`;
    const { data: signed, error } = await supabaseAdmin.storage
      .from("media")
      .createSignedUploadUrl(path);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, path, token: signed.token, signedUrl: signed.signedUrl };
  });

export const getMediaSignedUrl = createServerFn({ method: "POST" })
  .inputValidator((d: { path: string }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      return { ok: true as const, url: data.path };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage
      .from("media")
      .createSignedUrl(data.path, 60 * 60 * 24 * 365 * 5);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const, url: signed.signedUrl };
  });

export const updateAdminSiteSettings = createServerFn({ method: "POST" })
  .inputValidator((d: { settings: any }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      mockSiteSettings = data.settings;
      return { ok: true as const };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ key: "site_settings", value: data.settings, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

/* ─────────── Custom Services, Locations & Reviews ─────────── */

let mockCustomServices: any = null;
let mockCustomLocations: any = null;
let mockCustomReviews: any = null;

export const getCustomServices = createServerFn({ method: "GET" }).handler(async () => {
  if (isMockMode) {
    return { services: mockCustomServices };
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("site_content")
    .select("value")
    .eq("key", "custom_services")
    .maybeSingle();
  return { services: data?.value || null };
});

export const updateCustomServices = createServerFn({ method: "POST" })
  .inputValidator((d: { services: any }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      mockCustomServices = data.services;
      return { ok: true as const };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ key: "custom_services", value: data.services, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const getCustomLocations = createServerFn({ method: "GET" }).handler(async () => {
  if (isMockMode) {
    return { locations: mockCustomLocations };
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("site_content")
    .select("value")
    .eq("key", "custom_locations")
    .maybeSingle();
  return { locations: data?.value || null };
});

export const updateCustomLocations = createServerFn({ method: "POST" })
  .inputValidator((d: { locations: any }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      mockCustomLocations = data.locations;
      return { ok: true as const };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ key: "custom_locations", value: data.locations, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const getCustomReviews = createServerFn({ method: "GET" }).handler(async () => {
  if (isMockMode) {
    return { reviews: mockCustomReviews };
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("site_content")
    .select("value")
    .eq("key", "custom_reviews")
    .maybeSingle();
  return { reviews: data?.value || null };
});

export const updateCustomReviews = createServerFn({ method: "POST" })
  .inputValidator((d: { reviews: any }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      mockCustomReviews = data.reviews;
      return { ok: true as const };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ key: "custom_reviews", value: data.reviews, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

/* ─────────── Custom Pages SEO & Content ─────────── */

let mockCustomPagesSEO: any = null;

export const getCustomPagesSEO = createServerFn({ method: "GET" }).handler(async () => {
  if (isMockMode) {
    return { pages: mockCustomPagesSEO };
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("site_content")
    .select("value")
    .eq("key", "custom_pages_seo")
    .maybeSingle();
  return { pages: data?.value || null };
});

export const updateCustomPagesSEO = createServerFn({ method: "POST" })
  .inputValidator((d: { pages: any }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      mockCustomPagesSEO = data.pages;
      return { ok: true as const };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ key: "custom_pages_seo", value: data.pages, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

/* ─────────── Custom Home Sections ─────────── */

let mockCustomHomeSections: any = null;

export const getCustomHomeSections = createServerFn({ method: "GET" }).handler(async () => {
  if (isMockMode) {
    return { sections: mockCustomHomeSections };
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("site_content")
    .select("value")
    .eq("key", "custom_home_sections")
    .maybeSingle();
  return { sections: data?.value || null };
});

export const updateCustomHomeSections = createServerFn({ method: "POST" })
  .inputValidator((d: { sections: any }) => d)
  .handler(async ({ data }) => {
    await requireUnlocked();
    if (isMockMode) {
      mockCustomHomeSections = data.sections;
      return { ok: true as const };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ key: "custom_home_sections", value: data.sections, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });




