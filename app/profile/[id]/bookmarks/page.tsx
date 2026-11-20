import { BookmarksPage } from "#/pages/Bookmarks";
import { fetchDataViaGet } from "#/api/utils";
import type { Metadata, ResolvingMetadata } from "next";
import { API_URL } from "#/api/config";

export async function generateMetadata(
  { params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
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
    title: "Закладки Пользователя - " + data.profile.login,
    description: "Закладки Пользователя - " + data.profile.login,
    openGraph: {
      ...previousOG,
      url: `${process.env.METADATA_BASE_URL || "https://example.com"}/profile/${id}/bookmarks`,
      images: [],
    },
  };
}

export default async function Index({ params }) {
  const { id } = await params;
  return <BookmarksPage profile_id={id} />;
}
