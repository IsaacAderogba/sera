import { Box } from "../../components/Box";
import { Flex } from "../../components/Flex";
import { Logo } from "../../components/Logo";
import { keyframes } from "../../utilities/stitches";

export const SoundWaveLogo: React.FC = () => {
  return (
    <Flex css={{ gap: "$sm", alignItems: "center" }}>
      <Box
        className="boxContainer"
        css={{
          display: "flex",
          justifyContent: "space-between",
          gap: "$xxs",
          height: "36px",
          ".box": {
            transform: "scaleY(.4)",
            height: "100%",
            width: "6px",
            background: "#3F6CFE",
            animationDuration: "1.2s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            borderRadius: "8px"
          }
        }}
      >
        <Box className="box" css={{ animationName: `${quiet}` }} />
        <Box className="box" css={{ animationName: `${normal}` }} />
        <Box className="box" css={{ animationName: `${quiet}` }} />
        <Box className="box" css={{ animationName: `${loud}` }} />
        <Box className="box" css={{ animationName: `${quiet}` }} />
      </Box>
      <Logo />
    </Flex>
  );
};

const quiet = keyframes({
  "25%": { transform: "scaleY(.6)" },
  "50%": { transform: "scaleY(.4)" },
  "75%": { transform: "scaleY(.8)" }
});

const normal = keyframes({
  "25%": { transform: "scaleY(1)" },
  "50%": { transform: "scaleY(.4)" },
  "75%": { transform: "scaleY(.6)" }
});

const loud = keyframes({
  "25%": { transform: "scaleY(1)" },
  "50%": { transform: "scaleY(.4)" },
  "75%": { transform: "scaleY(1.2)" }
});
