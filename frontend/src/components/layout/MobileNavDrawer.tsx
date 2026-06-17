import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  Flex,
  IconButton,
  Stack,
} from "@chakra-ui/react";

import { CloseIcon } from "../icons/CloseIcon";
import { PlaceholderNavLink } from "./AppShell";
import { navigationItems } from "./navigation";
import { ThemeToggle } from "./ThemeToggle";

type MobileNavDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileNavDrawer({ open, onOpenChange }: MobileNavDrawerProps) {
  return (
    <DrawerRoot
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
      placement="start"
    >
      <DrawerBackdrop />
      <DrawerPositioner>
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Flex justify="space-between" align="center" gap="3">
              <DrawerTitle>Navigation</DrawerTitle>
              <DrawerCloseTrigger asChild>
                <IconButton
                  aria-label="Close navigation menu"
                  variant="ghost"
                  size="sm"
                >
                  <CloseIcon />
                </IconButton>
              </DrawerCloseTrigger>
            </Flex>
          </DrawerHeader>
          <DrawerBody py="4">
            <Stack gap="6">
              <Stack as="nav" aria-label="Mobile navigation" gap="1">
                {navigationItems.map((item) => (
                  <PlaceholderNavLink
                    key={item.to}
                    to={item.to}
                    onNavigate={() => onOpenChange(false)}
                  >
                    {item.label}
                  </PlaceholderNavLink>
                ))}
              </Stack>
              <ThemeToggle />
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </DrawerPositioner>
    </DrawerRoot>
  );
}
