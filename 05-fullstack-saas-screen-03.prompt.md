# PlanForge Dashboard

## Overall Vibe
Executive overview dashboard providing at-a-glance project and team metrics. Clean, minimal design with prominent KPI cards and visual charts. Supporting decision-making with real-time progress tracking.

## Design System
- Typography: Manrope for headlines, Inter for labels and values
- Color Palette: Professional blues, greens, grays with accent colors for metrics
- Spacing: Generous padding, 24px gaps between sections
- Cards: Light background, subtle shadows, clean typography hierarchy
- Charts: Simple line and bar charts with clear data visualization

## Page Structure
1. Page Header
   - "Dashboard" title
   - Date range selector: "Last 30 days"
   - Refresh button

2. KPI Cards Section (4 columns grid)
   - Total Projects: 8 (blue icon)
   - Total Tasks: 42 (green icon)
   - Completed Tasks: 28 (75%) (teal icon)
   - Team Members: 5 (purple icon)
   - Cards display large numbers, subtitle labels, icons

3. Recent Projects Section
   - Headline: "Recent Projects"
   - Cards showing:
     * Project name
     * Progress bar (0-100%)
     * Task count (e.g., "12/18 tasks")
     * Team members avatars
     * Last updated date
   - Example projects:
     * Website Redesign: 65% complete, 12/18 tasks
     * Mobile App: 40% complete, 8/20 tasks
     * Q2 Planning: 85% complete, 17/20 tasks

4. Task Completion Trend Chart
   - Line chart showing task completion over past 30 days
   - X-axis: dates
   - Y-axis: completed tasks count
   - Green line showing upward trend
