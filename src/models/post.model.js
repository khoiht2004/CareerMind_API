const prisma = require("@/libs/prisma");

const POST_LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverUrl: true,
  category: true,
  authorName: true,
  authorId: true,
  isPublished: true,
  viewCount: true,
  createdAt: true,
};

const POST_DETAIL_SELECT = {
  ...POST_LIST_SELECT,
  content: true,
  contentFormat: true,
  updatedAt: true,
};

const slugify = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildPostPayload = (data, authorId) => {
  const title = data.title?.trim();
  const slug = data.slug?.trim() || slugify(title);

  return {
    title,
    slug: slug || undefined,
    excerpt: data.excerpt?.trim() || null,
    content: data.content,
    contentFormat: data.contentFormat || "HTML",
    coverUrl: data.coverUrl?.trim() || null,
    category: data.category?.trim() || null,
    authorName: data.authorName?.trim() || null,
    isPublished:
      data.isPublished === undefined ? true : Boolean(data.isPublished),
    ...(authorId && { authorId }),
  };
};

async function getPosts({ page = 1, limit = 9, search, category, companyId }) {
  const where = {
    isPublished: true,
    ...(companyId && { author: { is: { companyId } } }),
    ...(category && category !== "ALL" && { category }),
    ...(search && {
      OR: [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.post.findMany({
      where,
      select: POST_LIST_SELECT,
      orderBy: { createdAt: "desc" },
      skip: (+page - 1) * +limit,
      take: +limit,
    }),
    prisma.post.count({ where }),
  ]);

  return { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) };
}

async function getPostById(id) {
  const exists = await prisma.post.findUnique({
    where: { id },
    select: { id: true, isPublished: true },
  });
  if (!exists?.isPublished) return null;

  return prisma.post.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
    select: POST_DETAIL_SELECT,
  });
}

async function getMyPosts(userId, { page = 1, limit = 10, search, status }) {
  const where = {
    authorId: userId,
    ...(status !== undefined &&
      status !== "ALL" && { isPublished: status === "PUBLISHED" }),
    ...(search && {
      OR: [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.post.findMany({
      where,
      select: POST_DETAIL_SELECT,
      orderBy: { createdAt: "desc" },
      skip: (+page - 1) * +limit,
      take: +limit,
    }),
    prisma.post.count({ where }),
  ]);

  return { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) };
}

async function createPost(data, authorId) {
  return prisma.post.create({
    data: buildPostPayload(data, authorId),
    select: POST_DETAIL_SELECT,
  });
}

async function updatePost(id, data) {
  return prisma.post.update({
    where: { id },
    data: buildPostPayload(data),
    select: POST_DETAIL_SELECT,
  });
}

async function deletePost(id) {
  return prisma.post.delete({ where: { id } });
}

async function getEditablePost(id) {
  return prisma.post.findUnique({
    where: { id },
    select: POST_DETAIL_SELECT,
  });
}

module.exports = {
  getPosts,
  getPostById,
  getMyPosts,
  createPost,
  updatePost,
  deletePost,
  getEditablePost,
};
