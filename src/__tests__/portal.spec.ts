import { describe, expect, it } from "vitest";

import { usePortal } from "@/composables/usePortal";
import { PORTAL_CONFIG, getTargetAttribute, hasSubmenu, isExternalLink } from "@/lib/config/portal";

describe("Portal Configuration", () => {
  it("should have correct portal name", () => {
    expect(PORTAL_CONFIG.name).toBe("Portal Resmi Kabupaten Kutai Kartanegara");
  });

  it("should have correct tagline", () => {
    expect(PORTAL_CONFIG.tagline).toBe("Kukar Idaman Mitra Pembangunan IKN");
  });

  it("should have correct website URL", () => {
    expect(PORTAL_CONFIG.websiteUrl).toBe("/beranda");
  });

  it("should have menu IDs with submenu", () => {
    expect(PORTAL_CONFIG.menu.hasSubmenu).toEqual([1, 2, 3, 5]);
  });

  it("should have external links configured", () => {
    expect(PORTAL_CONFIG.menu.externalLinks).toContain("https://www.lapor.go.id/instansi/pemerintah-kabupaten-kutai-kartanegara");
  });
});

describe("Portal Helper Functions", () => {
  it("should detect external links correctly", () => {
    expect(isExternalLink("https://example.com")).toBe(true);
    expect(isExternalLink("http://example.com")).toBe(true);
    expect(isExternalLink("#")).toBe(false);
    expect(isExternalLink("/internal-link")).toBe(false);
  });

  it("should return correct target attribute", () => {
    expect(getTargetAttribute("https://example.com")).toBe("_blank");
    expect(getTargetAttribute("#")).toBeUndefined();
    expect(getTargetAttribute("/internal-link")).toBeUndefined();
  });

  it("should check if menu has submenu", () => {
    expect(hasSubmenu(1)).toBe(true);
    expect(hasSubmenu(2)).toBe(true);
    expect(hasSubmenu(3)).toBe(true);
    expect(hasSubmenu(4)).toBe(false);
    expect(hasSubmenu(5)).toBe(true);
  });
});

describe("usePortal Composable", () => {
  it("should return portal composable with all required properties", () => {
    const portal = usePortal();

    expect(portal.menus).toBeDefined();
    expect(portal.containerMenus).toBeDefined();
    expect(portal.openSubMenu).toBeDefined();
    expect(portal.hasOpenSubMenu).toBeDefined();
    expect(portal.toggleSubMenu).toBeDefined();
    expect(portal.closeSubMenu).toBeDefined();
    expect(portal.getAssetUrl).toBeDefined();
    expect(portal.isExternalLink).toBeDefined();
    expect(portal.getTargetAttribute).toBeDefined();
    expect(portal.config).toBeDefined();
  });

  it("should have menus data", () => {
    const portal = usePortal();

    expect(portal.menus.value).toBeInstanceOf(Array);
    expect(portal.menus.value.length).toBeGreaterThan(0);

    // Check first menu structure
    const firstMenu = portal.menus.value[0];
    expect(firstMenu).toHaveProperty("id");
    expect(firstMenu).toHaveProperty("judul");
    expect(firstMenu).toHaveProperty("link");
    expect(firstMenu).toHaveProperty("icon");
  });

  it("should have container menus data", () => {
    const portal = usePortal();

    expect(portal.containerMenus.value).toBeInstanceOf(Array);
    expect(portal.containerMenus.value.length).toBeGreaterThan(0);

    // Check first container menu structure
    const firstContainerMenu = portal.containerMenus.value[0];
    expect(firstContainerMenu).toHaveProperty("sub");
    expect(firstContainerMenu).toHaveProperty("kat");
    expect(Array.isArray(firstContainerMenu.sub)).toBe(true);
    expect(Array.isArray(firstContainerMenu.kat)).toBe(true);
  });

  it("should handle submenu toggle correctly", () => {
    const portal = usePortal();

    // Initially no submenu should be open
    expect(portal.openSubMenu.value).toBeNull();

    // Toggle submenu
    portal.toggleSubMenu(1);
    expect(portal.openSubMenu.value).toBe(1);

    // Toggle same submenu should close it
    portal.toggleSubMenu(1);
    expect(portal.openSubMenu.value).toBeNull();

    // Toggle different submenu
    portal.toggleSubMenu(2);
    expect(portal.openSubMenu.value).toBe(2);
  });

  it("should close submenu correctly", () => {
    const portal = usePortal();

    // Open a submenu
    portal.toggleSubMenu(1);
    expect(portal.openSubMenu.value).toBe(1);

    // Close submenu
    portal.closeSubMenu();
    expect(portal.openSubMenu.value).toBeNull();
  });

  it("should compute hasOpenSubMenu correctly", () => {
    const portal = usePortal();

    // Initially no submenu open
    expect(portal.hasOpenSubMenu.value).toBe(false);

    // Open submenu
    portal.toggleSubMenu(1);
    expect(portal.hasOpenSubMenu.value).toBe(true);

    // Close submenu
    portal.closeSubMenu();
    expect(portal.hasOpenSubMenu.value).toBe(false);
  });

  it("should generate asset URL correctly", () => {
    const portal = usePortal();

    const assetUrl = portal.getAssetUrl("images/test.png");
    expect(assetUrl).toBe("/src/assets/images/test.png");
  });
});
