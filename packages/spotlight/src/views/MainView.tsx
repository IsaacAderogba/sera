import { Flex } from "../components/Flex";
import { CommandAction } from "../patterns/command/CommandAction";
import { CommandInput } from "../patterns/command/CommandInput";
import { CommandItem } from "../patterns/command/CommandItem";
import { CommandLayout } from "../patterns/command/CommandLayout";
import { CommandProvider } from "../patterns/command/CommandProvider";
import { CommandSection } from "../patterns/command/CommandSection";

export const MainView: React.FC = () => {
  return (
    <Flex
      className="drag"
      css={{
        background: "$translucent",
        height: "100%",
        flexDirection: "column",
        overflow: "auto"
      }}
    >
      <div>editor</div>
      <div className="no-drag">
        <CommandProvider>
          <CommandInput />
          <CommandLayout type="list">
            <CommandSection title="Section 1">
              <CommandItem title="Item" icon="i">
                <CommandAction title="Action" shortcut="Command+1" icon="i" />
                <CommandAction title="Action" shortcut="Command+2" icon="i" />
              </CommandItem>
              <CommandItem title="Item 2" icon="i">
                <CommandAction title="Action" shortcut="Command+1" icon="i" />
                <CommandAction title="Action" shortcut="Command+2" icon="i" />
              </CommandItem>
            </CommandSection>
            <CommandSection title="Section 2">
              <CommandItem title="Item" icon="i">
                <CommandAction title="Action" shortcut="Command+1" icon="i" />
                <CommandAction title="Action" shortcut="Command+2" icon="i" />
              </CommandItem>
              <CommandItem title="Item 2" icon="i">
                <CommandAction title="Action" shortcut="Command+1" icon="i" />
                <CommandAction title="Action" shortcut="Command+2" icon="i" />
              </CommandItem>
            </CommandSection>
          </CommandLayout>
        </CommandProvider>
      </div>
      <div>context lip</div>
    </Flex>
  );
};
