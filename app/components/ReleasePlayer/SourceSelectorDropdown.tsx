"use client";

import { ENDPOINTS } from "#/api/config";
import { useEffect } from "react";
import { _fetchAPI } from "./PlayerParsing";
import { useUserPlayerPreferencesStore } from "#/store/player";
import { numberDeclension } from "#/api/utils";
import { Voiceover } from "./VoiceoverSelectorMenu";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";

export interface Source {
  id: number;
  name: string;
  episodes_count: number;
}

interface SourceSelectorMenuProps {
  release_id: number;
  setSource: (state) => void;
  voiceover: Voiceover;
  source: Source;
  sourceList: Source[];
  setPlayerError: (state) => void;
}

export const SourceSelectorDropdown = ({
  release_id,
  setSource,
  voiceover,
  source,
  sourceList,
  setPlayerError,
}: SourceSelectorMenuProps) => {
  const playerPreferenceStore = useUserPlayerPreferencesStore();
  const preferredSource = playerPreferenceStore.getPreferredPlayer(release_id);

  useEffect(() => {
    const __getInfo = async () => {
      let url = `${ENDPOINTS.release.episode}/${release_id}/${voiceover.id}`;
      const src = await _fetchAPI(
        url,
        "Не удалось получить информацию о источниках",
        setPlayerError,
      );
      if (src) {
        const selectedSrc =
          src.sources.find(
            (source: Source) => source.name === preferredSource,
          ) || src.sources[0];
        if (selectedSrc.episodes_count == 0) {
          const remSources = src.sources.filter(
            (source: any) => source.id !== selectedSrc.id,
          );
          setSource({
            selected: remSources[0],
            available: remSources,
          });
          return;
        }
        setSource({
          selected: selectedSrc,
          available: src.sources,
        });
      }
    };
    if (voiceover) {
      __getInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceover]);

  if (!voiceover || !source || !sourceList || sourceList.length <= 1)
    return <></>;

  return (
    <Dropdown
      size="xs"
      className="overflow-y-auto max-h-[256px] bg-black/50 backdrop-blur-sm"
      label={
        <div className="flex items-center gap-2">
          <span className="text-sm leading-none whitespace-nowrap">
            {source.name}
          </span>
        </div>
      }
    >
      {sourceList && sourceList.length > 0
        ? sourceList.map((item) => (
            <div key={`player.source.${release_id}.${voiceover.id}.${item.id}`}>
              <DropdownItem
                className="flex-col items-start"
                onClick={() => {
                  setSource({
                    selected: item,
                    available: sourceList,
                  });
                  playerPreferenceStore.setPreferredPlayer(
                    release_id,
                    item.name,
                  );
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm leading-none whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
                <div className="flex flex-col items-start mt-2">
                  <span>
                    {item.episodes_count}{" "}
                    {numberDeclension(
                      item.episodes_count,
                      "серия",
                      "серии",
                      "серий",
                    )}
                  </span>
                </div>
              </DropdownItem>
              <DropdownDivider />
            </div>
          ))
        : ""}
    </Dropdown>
  );
};
