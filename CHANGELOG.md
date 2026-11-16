# Osysharp.Ui — changes

## 3.5.0
- `note:` on `SettingSwitch`, `SettingChoice` and `SettingNumber` — a line on the row's provenance line (the latest reason).
- `words:` on `SettingNumber` — a read-only number said in the app's own words ("8 dollars"), a display formatter.
- `SettingsPage` draws its head as a band across the whole area (the page-head tokens' ground, rule and padding) with its title
  and line in the page's column; `PageHead` gains `column:` (`PageColumn.Settings` / `People`) to draw a page's head the same way. On the floor the
  band is transparent and the rule is `Length.PageHeadEdge`'s.
- Theme tokens for the runtime's busy spinner: `Colors.SpinnerInk` (default `currentColor`) and `Length.SpinnerSize` (default `1em`).
- `FontSize.PageSectionTitle` (default `Subhead`) and the `PageSectionHeading(text)` control — a page section's heading, smaller than
  the page title when a shell says so.
