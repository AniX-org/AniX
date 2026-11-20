"use client";

import { ENDPOINTS } from "#/api/config";
import { useEffect } from "react";
import { _fetchAPI } from "./PlayerParsing";
import { useUserPlayerPreferencesStore } from "#/store/player";
import { numberDeclension } from "#/api/utils";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";

export interface Voiceover {
  id: number;
  name: string;
  icon: string;
  episodes_count: number;
  view_count: number;
  pinned: boolean;
}

interface VoiceoverSelectorMenuProps {
  release_id: number;
  token: string | null;
  setVoiceover: (state) => void;
  voiceover: Voiceover;
  voiceoverList: Voiceover[];
  setPlayerError: (state) => void;
}

export const VoiceoverSelectorDropdown = ({
  release_id,
  token,
  setVoiceover,
  voiceover,
  voiceoverList,
  setPlayerError,
}: VoiceoverSelectorMenuProps) => {
  const playerPreferenceStore = useUserPlayerPreferencesStore();
  const preferredVO = playerPreferenceStore.getPreferredVoiceover(release_id);

  useEffect(() => {
    const __getInfo = async () => {
      let url = `${ENDPOINTS.release.episode}/${release_id}`;
      if (token) {
        url += `?token=${token}`;
      }
      const vo = await _fetchAPI(
        url,
        "Не удалось получить информацию о озвучках",
        setPlayerError,
        { 1: "Просмотр запрещён" },
      );
      if (vo) {
        const selectedVO =
          vo.types.find(
            (voiceover: Voiceover) => voiceover.name === preferredVO,
          ) || vo.types[0];
        setVoiceover({
          selected: selectedVO,
          available: vo.types,
        });
      }
    };
    __getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [release_id, token]);

  if (!voiceover) return <></>;

  return (
    <Dropdown
      size="xs"
      className="overflow-y-auto max-h-[256px]  bg-black/50 backdrop-blur-sm"
      label={
        <div className="flex items-center gap-2">
          {voiceover.icon ? (
            <img
              alt=""
              className="w-4 h-4 rounded-full"
              src={voiceover.icon}
            ></img>
          ) : (
            ""
          )}
          <span className="text-sm leading-none whitespace-nowrap">
            {voiceover.name}
          </span>
        </div>
      }
    >
      {voiceoverList && voiceoverList.length > 0
        ? voiceoverList.map((item) => (
            <div key={`player.voiceover.${release_id}.${item.id}`}>
              <DropdownItem
                className="flex-col items-start"
                onClick={() => {
                  setVoiceover({
                    selected: item,
                    available: voiceoverList,
                  });
                  playerPreferenceStore.setPreferredVoiceover(
                    release_id,
                    item.name,
                  );
                }}
              >
                <div className="flex items-center gap-2">
                  {item.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt=""
                      className="w-4 h-4 rounded-full"
                      src={item.icon}
                    ></img>
                  ) : (
                    ""
                  )}
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
                  <span className="flex items-center gap-1">
                    {item.view_count}
                    <span className={`iconify solar--eye-bold h-4 w-4`}></span>
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
