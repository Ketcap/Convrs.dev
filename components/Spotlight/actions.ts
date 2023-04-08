import { SpotlightAction } from "@mantine/spotlight";
import { navbarState, newChatroomModal } from "@/states/navbarState";

export const basicActions: SpotlightAction[] = [
  {
    id: 'new-chat',
    title: 'Start New Chat',
    description: 'Start a new chat with an AI',
    onTrigger: () => {
      newChatroomModal.value = true;
    }
  },
  {
    id: 'toggle-navbar',
    title: 'Toggle Navbar',
    description: 'Toggle navbar visibility',
    onTrigger: () => {
      navbarState.value = !navbarState.value;
    }
  }
]