import { IndexCategoryPage } from "#/pages/IndexCategory";
export const dynamic = 'force-static';

const SectionTitleMapping = {
  last: "Последние релизы",
  finished: "Завершенные релизы",
  ongoing: "Выходит",
  announce: "Анонсированные релизы",
  films: "Фильмы",
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
    <IndexCategoryPage
      slug={slug}
      SectionTitleMapping={SectionTitleMapping}
    />
  );
}
