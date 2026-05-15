const prisma = require("@/libs/prisma");

const POST_LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverUrl: true,
  category: true,
  authorName: true,
  viewCount: true,
  createdAt: true,
};

const POST_DETAIL_SELECT = {
  ...POST_LIST_SELECT,
  content: true,
  updatedAt: true,
};

async function getPosts({ page = 1, limit = 9, search, category }) {
  const where = {
    isPublished: true,
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

module.exports = { getPosts, getPostById };
