import { BookmarksCategoryPage } from "#/pages/BookmarksCategory";
import { fetchDataViaGet } from "#/api/utils";
import type { Metadata, ResolvingMetadata } from "next";
import { API_URL } from "#/api/config";

const SectionTitleMapping = {
  watching: "Смотрю",
  planned: "В планах",
  watched: "Просмотрено",
  delayed: "Отложено",
  abandoned: "Заброшено",
};

export async function generateMetadata(
  { params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id, slug } = await params;
  const { data, error } = await fetchDataViaGet(
    `${API_URL}/profile/${id}`
  );
  const previousOG = (await parent).openGraph;

  if (error) {
    return {
      title: "Ошибка",
      description: "Ошибка",
    };
  };

  return {
    title:"Закладки Пользователя - " + data.profile.login + " - " + SectionTitleMapping[slug],
    description: "Закладки Пользователя - " + data.profile.login + " - " + SectionTitleMapping[slug],
    openGraph: {
      ...previousOG,
      url: `${process.env.METADATA_BASE_URL || "https://example.com"}/profile/${id}/bookmarks/${slug}`,
      images: [],
    },
  };
}

export default async function Index({ params }) {
  const { id, slug } = await params;
  return (
    <BookmarksCategoryPage
      slug={slug}
      SectionTitleMapping={SectionTitleMapping}
      profile_id={id}
    />
  );
}
