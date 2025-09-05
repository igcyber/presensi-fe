<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
</script>

<template>
  <div class="px-5 py-6">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <Button class="flex items-center gap-2">
        <PlusIcon class="h-4 w-4" />
        Dashboard
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>List of users dengan fitur pencarian, sorting, dan pagination</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <h1>Dashboard</h1>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
