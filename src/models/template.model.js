const prisma = require("@/libs/prisma");

const TEMPLATE_SELECT = {
  id: true,
  title: true,
  industry: true,
  level: true,
  content: true,
  previewUrl: true,
  createdAt: true,
};

const COVER_LETTER_TEMPLATE_SELECT = {
  id: true,
  title: true,
  industry: true,
  level: true,
  content: true,
  createdAt: true,
};

const buildWhere = ({ search, industry, level }) => ({
  isActive: true,
  ...(industry && industry !== "ALL" && { industry }),
  ...(level && level !== "ALL" && { level }),
  ...(search && {
    OR: [
      { title: { contains: search } },
      { industry: { contains: search } },
      { content: { contains: search } },
    ],
  }),
});

async function getCvTemplates({ page = 1, limit = 12, search, industry, level }) {
  const where = buildWhere({ search, industry, level });
  const [data, total] = await Promise.all([
    prisma.cvTemplate.findMany({
      where,
      select: TEMPLATE_SELECT,
      orderBy: { createdAt: "desc" },
      skip: (+page - 1) * +limit,
      take: +limit,
    }),
    prisma.cvTemplate.count({ where }),
  ]);

  return { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) };
}

async function getCoverLetterTemplates({ page = 1, limit = 12, search, industry, level }) {
  const where = buildWhere({ search, industry, level });
  const [data, total] = await Promise.all([
    prisma.coverLetterTemplate.findMany({
      where,
      select: COVER_LETTER_TEMPLATE_SELECT,
      orderBy: { createdAt: "desc" },
      skip: (+page - 1) * +limit,
      take: +limit,
    }),
    prisma.coverLetterTemplate.count({ where }),
  ]);

  return { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) };
}

module.exports = { getCvTemplates, getCoverLetterTemplates };
