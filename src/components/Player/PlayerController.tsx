"use client";

import { PlaylistContext } from "@/lib/hooks/usePlayerState";
import { Box, Flex, HStack, useToast } from "@chakra-ui/react";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { usePlayer } from "../Providers/PlayerProvider";
import BottomGradientOverlay from "./BottomGradientOverlay";
import Player1 from "./Player1";
import Player2 from "./Player2";
import Controls from "./Controls";
import useKandi from "@/lib/hooks/useKandi";
import CustomToast from "../Common/CustomToast";

type SearchParam = string | string[] | undefined;

export default function PlayerController({
  playlistContext,
  typeSearchParam,
}: {
  playlistContext: PlaylistContext;
  typeSearchParam: SearchParam;
}) {
  const { setPlaylistContext } = usePlayer();
  const [playerState, setPlayerState] = useState<number>(1);
  const { handleDonation } = useKandi();
  const toast = useToast();

  const searchParamToPlayerState = (type: SearchParam) => {
    if (type === "2") return 2;
    else return 1; // default to this case for now
  };

  useEffect(() => {
    setPlaylistContext(playlistContext!);
    setPlayerState(searchParamToPlayerState(typeSearchParam));

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleDonation();

        // TODO: Change this to be a more satisfying visual indicator
        toast({
          position: "bottom",
          duration: 1000,
          description: "Received donation request!",
          status: "info",
        });
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <PlayerControllerWrapper>
      <PlayerControllerInner
        playlistContext={playlistContext}
        playerState={playerState}
      />
      <PlayerSwitcher
        playerState={playerState}
        setPlayerState={setPlayerState}
      />
    </PlayerControllerWrapper>
  );
}

function PlayerControllerWrapper({ children }: { children: ReactNode }) {
  return <Flex h="100vh">{children}</Flex>;
}

function PlayerControllerInner({
  playlistContext,
  playerState,
}: {
  playlistContext: PlaylistContext;
  playerState: number;
}) {
  switch (playerState) {
    case 1:
      return (
        <>
          <Player1 playlistContext={playlistContext} />
          <BottomGradientOverlay
            start={{ red: 255, green: 255, blue: 255, opacity: 0.5 }}
            end={{ red: 255, green: 255, blue: 255, opacity: 0 }}
          />
        </>
      );
    case 2:
      return (
        <>
          <Player2 playlistContext={playlistContext} />
          <BottomGradientOverlay
            start={{ red: 255, green: 255, blue: 255, opacity: 0.8 }}
            end={{ red: 255, green: 255, blue: 255, opacity: 0 }}
            percentCover={30}
          />
        </>
      );
    default:
      return <Player1 playlistContext={playlistContext} />;
  }
}

/*
Should probably make this more clear, but PlayerSwitcher also takes on 
Controls functionality at smaller screen sizes.

There's lowkey some really hidden things going on here to make this
work at different resolutions but we can always refactor that.

Just note that the Controls, ClickIcon, and NowPlaying
components are ALL coupled with the same logic.
*/
function PlayerSwitcher({
  playerState,
  setPlayerState,
}: {
  playerState: number;
  setPlayerState: Dispatch<SetStateAction<number>>;
}) {
  return (
    <Flex
      position="fixed"
      bottom="20px"
      left="50%"
      transform={"translateX(-50%)"}
      bg=""
      zIndex={5}
      w="100%"
      align="center"
      justify="center"
    >
      <HStack flex={1} align="center" justify="center">
        <PlayerCircle
          circleState={1}
          playerState={playerState}
          setPlayerState={setPlayerState}
        />
        <PlayerCircle
          circleState={2}
          playerState={playerState}
          setPlayerState={setPlayerState}
        />
        <Flex w="20%" display={{ base: "flex", md: "none" }} />
        <Flex
          display={{ base: "flex", md: "none" }}
          align="center"
          justify="center"
        >
          <Controls />
        </Flex>
      </HStack>
    </Flex>
  );
}

function PlayerCircle({
  playerState,
  circleState,
  setPlayerState,
}: {
  playerState: number;
  circleState: number;
  setPlayerState: Dispatch<SetStateAction<number>>;
}) {
  const switchPlayerState = () => setPlayerState(circleState);
  return (
    <Box
      w={{ base: "20px", md: "10px" }}
      h={{ base: "20px", md: "10px" }}
      mr={{ base: 2, md: 2 }}
      bg={playerState === circleState ? "black" : "transparent"}
      border="1px solid black"
      borderRadius="100%"
      _hover={{ cursor: "pointer" }}
      onClick={switchPlayerState}
    />
  );
}