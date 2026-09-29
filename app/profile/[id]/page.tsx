import { ProfilePage } from "#/pages/Profile";
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
  }

  return {
    title: "Профиль - " + data.profile.login,
    description: data.profile.status,
    openGraph: {
      ...previousOG,
      url: `${process.env.METADATA_BASE_URL || "https://example.com"}/profile/${id}`,
      images: [
        {
          url: data.profile.avatar, // Must be an absolute URL
          width: 600,
          height: 600,
        },
      ],
    },
  };
}

export default async function Profile({ params }) {
  const { id } = await params;
  return <ProfilePage id={id} />;
}
