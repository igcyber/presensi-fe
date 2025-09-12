<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { Moon, Sun } from "lucide-vue-next";
import { RouterLink, RouterView } from "vue-router";

import AppSidebar from "@/components/layout/AppSidebar.vue";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { useBreadcrumb } from "@/composables/useBreadcrumb";

const { breadcrumbItems } = useBreadcrumb();

const mode = useColorMode();
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset class="flex h-screen flex-col overflow-hidden">
      <header
        class="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 dark:border-gray-700"
      >
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1" />
            <Separator orientation="vertical" class="mr-2 !h-5" />
            <Breadcrumb>
              <BreadcrumbList>
                <template v-for="(item, index) in breadcrumbItems" :key="item.label">
                  <template v-if="item.href && item.href !== '#'">
                    <BreadcrumbItem class="hidden md:block">
                      <BreadcrumbLink as-child>
                        <RouterLink :to="item.href"> {{ item.label }} </RouterLink>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </template>
                  <template v-else>
                    <BreadcrumbItem>
                      <BreadcrumbPage> {{ item.label }} </BreadcrumbPage>
                    </BreadcrumbItem>
                  </template>
                  <BreadcrumbSeparator v-if="index !== breadcrumbItems.length - 1" class="hidden md:block" />
                </template>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div class="flex items-center gap-2 px-4">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon">
                  <Sun v-if="mode === 'light'" />
                  <Moon v-else />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="mr-5">
                <DropdownMenuLabel>Light and Dark</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="mode = 'light'">
                  <Sun />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem @click="mode = 'dark'">
                  <Moon />
                  Dark
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <!-- Content wrapper -->
      <main class="overflow-y-auto">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
