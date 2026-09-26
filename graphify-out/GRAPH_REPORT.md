# Graph Report - ukk-11  (2026-09-26)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 572 nodes · 1167 edges · 25 communities (22 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `389c49d9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24

## God Nodes (most connected - your core abstractions)
1. `react` - 47 edges
2. `cn()` - 25 edges
3. `Booking` - 19 edges
4. `BookingItem` - 18 edges
5. `compilerOptions` - 18 edges
6. `Lapangan` - 16 edges
7. `SlotRangeSelection` - 15 edges
8. `compilerOptions` - 15 edges
9. `getTodayISODate()` - 13 edges
10. `lucide-react` - 13 edges

## Surprising Connections (you probably didn't know these)
- `BookingReceiptViewProps` --references--> `BookingItem`  [EXTRACTED]
  src/components/reservation/components/BookingReceiptView.tsx → src/components/reservation/types.ts
- `BookedSlotCardProps` --references--> `BookingItem`  [EXTRACTED]
  src/components/reservation/components/grid/BookedSlotCard.tsx → src/components/reservation/types.ts
- `InspectBookingViewProps` --references--> `BookingItem`  [EXTRACTED]
  src/components/reservation/components/inspector/InspectBookingView.tsx → src/components/reservation/types.ts
- `ScheduleHeaderProps` --references--> `Court`  [EXTRACTED]
  src/components/reservation/components/ScheduleHeader.tsx → src/components/reservation/types.ts
- `Props` --references--> `Lapangan`  [EXTRACTED]
  src/components/booking/CourtSelector.tsx → src/types/database.ts

## Import Cycles
- None detected.

## Communities (25 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (52): CourtScheduleGrid(), BookingReceiptView(), BookingReceiptViewProps, ActiveSelectionCard(), ActiveSelectionCardProps, BookedSlotCard(), BookedSlotCardProps, FloatingToast() (+44 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (42): @supabase/supabase-js, PilihLapangan(), Props, CashierStatsProps, CashierTableProps, CashierTableRow(), Props, CourtManagerModal() (+34 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (30): gsap, src_assets_hero_video, CenterFlyingLogo(), CenterFlyingLogoProps, DesktopNavLinks(), DesktopNavLinksProps, HeaderLogo(), HeaderLogoProps (+22 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (31): BookedByHourCard(), Props, BookingStatusCard(), Props, COURTS_PILLS, CourtScheduleCard(), Props, CourtStatisticCard() (+23 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (22): lenis, BlancaCta(), BlancaCtaProps, BlancaDifference(), BlancaFaq(), BlancaFooter(), DifferenceCommunityStory(), DifferenceFeatures() (+14 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (27): clsx, @radix-ui/react-checkbox, tailwind-merge, SortField, SortOrder, Badge(), BadgeProps, Button (+19 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (24): lucide-react, recharts, BookingDetailSheet(), BookingsTable(), DashboardOverview(), DashboardOverviewProps, Header(), HeaderProps (+16 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (18): react, react-dom, App(), src_components_blanca_blanca, Props, RingkasanBiaya(), FormPemesan(), Props (+10 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (14): leaflet, BlancaLocations(), BlancaContactCard(), BlancaContactCardProps, BlancaContactPanel(), BlancaContactPanelProps, BlancaLocationHeader(), BlancaLocationMap() (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.14
Nodes (16): name, private, type, version, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+8 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (6): ref_child_process, ref_fs, ref_path, @playwright/test, pngjs, SNAPSHOTS_DIR

### Community 14 - "Community 14"
Cohesion: 0.23
Nodes (9): BlancaTechnology(), TechnologyHeading(), TechnologySlideDetails(), TechnologySlideDetailsProps, TechnologySlideMedia(), TechnologySlideMediaProps, TECHNOLOGY_SLIDES, useTechnologySlider() (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.13
Nodes (15): dependencies, clsx, gsap, leaflet, lenis, lucide-react, @radix-ui/react-checkbox, react (+7 more)

### Community 16 - "Community 16"
Cohesion: 0.13
Nodes (15): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @playwright/test, pngjs (+7 more)

### Community 17 - "Community 17"
Cohesion: 0.15
Nodes (9): CashierDatePicker(), CashierDatePickerProps, DAY_NAMES, MONTH_NAMES, DAY_NAMES, MONTH_NAMES, ReservationNavbar(), ReservationNavbarProps (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.38
Nodes (6): @tailwindcss/vite, vite, @vitejs/plugin-react, configurePreviewServer(), configureServer(), routeMiddleware()

### Community 19 - "Community 19"
Cohesion: 0.33
Nodes (5): diffImg, height, localImg, targetImg, width

### Community 20 - "Community 20"
Cohesion: 0.33
Nodes (5): diffImg, height, localImg, targetImg, width

### Community 21 - "Community 21"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

## Knowledge Gaps
- **150 isolated node(s):** `FloatingToastProps`, `TimeColumnProps`, `PaymentLoadingViewProps`, `HoveredSlotState`, `ReservationDataProps` (+145 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 176 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Community 7` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 4`, `Community 5`, `Community 6`, `Community 8`, `Community 10`, `Community 14`, `Community 17`?**
  _High betweenness centrality (0.537) - this node is a cross-community bridge._
- **Why does `pngjs` connect `Community 13` to `Community 10`, `Community 19`, `Community 20`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 15` to `Community 10`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `FloatingToastProps`, `TimeColumnProps`, `PaymentLoadingViewProps` to the rest of the system?**
  _150 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07286961758506474 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07457627118644068 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06763285024154589 - nodes in this community are weakly interconnected._