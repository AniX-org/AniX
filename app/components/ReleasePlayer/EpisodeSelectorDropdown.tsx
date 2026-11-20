"use client";

import { ENDPOINTS } from "#/api/config";
import { useEffect, useState } from "react";
import { _fetchAPI } from "./PlayerParsing";

import { Voiceover } from "./VoiceoverSelectorMenu";
import { Source } from "./SourceSelectorMenu";
import { getAnonEpisodesWatched } from "./ReleasePlayer";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";

export interface Episode {
  position: number;
  name: string;
  is_watched: boolean;
}
interface EpisodeSelectorMenuProps {
  release_id: number;
  voiceover: Voiceover;
  source: Source;
  token: string | null;
  setEpisode: (state) => void;
  episode: Episode;
  episodeList: Episode[];
  setPlayerError: (state) => void;
}

export const EpisodeSelectorDropdown = ({
  release_id,
  token,
  voiceover,
  source,
  setEpisode,
  episode,
  episodeList,
  setPlayerError,
}: EpisodeSelectorMenuProps) => {
  const [watchedEpisodes, setWatchedEpisodes] = useState([]);
  useEffect(() => {
    const __getInfo = async () => {
      let url = `${ENDPOINTS.release.episode}/${release_id}/${voiceover.id}/${source.id}`;
      if (token) {
        url += `?token=${token}`;
      }
      const episodes = await _fetchAPI(
        url,
        "Не удалось получить информацию о эпизодах",
        setPlayerError,
      );
      if (episodes) {
        let anonEpisodesWatched = getAnonEpisodesWatched(
          release_id,
          source.id,
          voiceover.id,
        );
        let lastEpisodeWatched = Math.max.apply(
          0,
          Object.keys(anonEpisodesWatched[release_id][source.id][voiceover.id]),
        );
        let selectedEpisode =
          episodes.episodes.find(
            (episode: Episode) => episode.position == lastEpisodeWatched,
          ) || episodes.episodes[0];

        setEpisode({
          selected: selectedEpisode,
          available: episodes.episodes,
        });
      }
    };
    if (source) {
      __getInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  useEffect(() => {
    if (release_id && source && voiceover) {
      const anonEpisodesWatched = getAnonEpisodesWatched(
        release_id,
        source.id,
        voiceover.id,
      );
      setWatchedEpisodes(
        anonEpisodesWatched[release_id][source.id][voiceover.id],
      );
    }
  }, [release_id, source, voiceover]);

  if (!voiceover || !source || !episode) return <></>;

  return (
    <Dropdown
      size="xs"
      className="overflow-y-auto max-h-[256px] bg-black/50 backdrop-blur-sm"
      label={
        <div className="flex items-center gap-2">
          <span className="text-sm leading-none whitespace-nowrap">
            {episode.name
              ? episode.name
              : ["Sibnet"].includes(source.name)
                ? `${episode.position + 1} Серия`
                : `${episode.position} Серия`}
          </span>
        </div>
      }
    >
      {episodeList && episodeList.length > 0
        ? episodeList.map((item) => (
            <div
              key={`player.episode.${release_id}.${voiceover.id}.${source.id}.${item.position}`}
            >
              <DropdownItem
                onClick={() => {
                  setEpisode({
                    selected: item,
                    available: episodeList,
                  });
                }}
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <span className="text-sm leading-none whitespace-nowrap">
                    {item.name
                      ? item.name
                      : ["Sibnet"].includes(source.name)
                        ? `${item.position + 1} Серия`
                        : `${item.position} Серия`}
                  </span>
                  {item.is_watched ||
                  Object.keys(watchedEpisodes).includes(
                    item.position.toString(),
                  ) ? (
                    <span className="w-4 h-4 iconify material-symbols--check-circle"></span>
                  ) : (
                    <span className="w-4 h-4 iconify material-symbols--check-circle-outline"></span>
                  )}
                </div>
              </DropdownItem>
            </div>
          ))
        : ""}
    </Dropdown>
  );

  // return (
  //   <div className="flex flex-col items-start justify-start gap-4">
  //     <p className="text-[20px] px-2 pt-2 pb-1 font-bold">Эпизод</p>
  //     <div className="max-h-full flex flex-col gap-4 items-start justify-start overflow-x-hidden overflow-y-auto px-2 pb-2 scrollbar-thin scrollbar-thumb-[rgb(60_60_60_/_.8)] scrollbar-track-[rgb(30_30_30_/_.8)]">
  //       {episodeList && episodeList.length > 0 ?
  //         episodeList.map((epis: Episode) => {
  //           return (
  //             <button
  //               key={`release-${release_id}-voiceover-${voiceover.id}-source-${source.id}-episode-${epis.position}`}
  //               className={`h-fit px-2 justify-start items-start ${episode.position == epis.position ? "text-white" : "text-gray-300 hover:text-gray-100"} transition-colors`}
  //               onClick={() => {
  //                 setEpisode({
  //                   selected: epis,
  //                   available: episodeList,
  //                 });
  //               }}
  //             >
  //               <div className="flex items-center justify-between gap-2 min-w-32">
  //                 <p className="text-[16px] leading-none whitespace-nowrap">
  //                   {epis.name ?
  //                     epis.name
  //                   : ["Sibnet"].includes(source.name) ?
  //                     `${epis.position + 1} Серия`
  //                   : `${epis.position} Серия`}
  //                 </p>
  //                 {(
  //                   epis.is_watched ||
  //                   Object.keys(watchedEpisodes).includes(
  //                     epis.position.toString()
  //                   )
  //                 ) ?
  //                   <span className="w-4 h-4 ml-2 iconify material-symbols--check-circle"></span>
  //                 : <span className="w-4 h-4 ml-2 iconify material-symbols--check-circle-outline"></span>
  //                 }
  //               </div>
  //             </button>
  //           );
  //         })
  //       : ""}
  //     </div>
  //   </div>
  // );
};
