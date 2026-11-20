import { BookmarksCategoryPage } from "#/pages/BookmarksCategory";
export const dynamic = 'force-static';

const SectionTitleMapping = {
  watching: "Смотрю",
  planned: "В планах",
  watched: "Просмотрено",
  delayed: "Отложено",
  abandoned: "Заброшено",
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: SectionTitleMapping[slug],
  };
}

export default async function Index({ params }) {
  const { slug } = await params;
  return (
    <BookmarksCategoryPage
      slug={slug}
      SectionTitleMapping={SectionTitleMapping}
    />
  );
}
