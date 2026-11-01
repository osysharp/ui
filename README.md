# Osysharp.Ui — the general application vocabulary for Osy# apps

## Use case

Every business app needs the same things before it needs anything of its own: buttons and fields that agree with each
other, dialogs and menus that trap focus and close on Escape, a data grid that sorts, filters and exports, settings
pages, empty and loading states — and a shell to hold it all: a sidebar or a rail, a top bar with search and a
command menu, a phone layout that turns the navigation into a drawer. This package is that vocabulary, written in
Osy# and themed by tokens, so an app re-skins it by declaring a `theme` rather than by restyling each control.

![A sidebar shell in the light theme](docs/sidebar-shell-light.png)

![A rail shell in the dark theme, with the data grid](docs/rail-shell-dark.png)

## Install and use

Every Osy# app has it in scope — the CLI ships it, so it resolves offline, with no `using` needed. Pin a major in
`app.osy` when you want a lock to name the version you built against:

```osy
app Fulcrum {
  use Osysharp.Ui@3;
  …
}
```

```osy
[Route("/orders")]
component Orders() {
  live var orders = Order.Where(o => o.Total >= 0);
  render {
    PageHead("Orders", subtitle: "Every open sales order.");
    DataGrid(
      rows: orders,
      label: "Orders",
      filterable: true,
      columns: [
        new GridColumn<Order> { Name = "Reference", Label = "Reference", Value = o => o.Reference },
        new GridColumn<Order> { Name = "Customer", Label = "Customer", Value = o => o.Customer },
        new GridColumn<Order> { Name = "Total", Label = "Total", Kind = GridColumnKind.Number,
                                Value = o => o.Total.ToString("N0"), Number = o => o.Total }
      ]);
  }
}
```

`osy kit` lists all of it with each control's arguments; `osy kit <Control>` prints one control's source, and
`osy kit shells` shows the arrangements a shell can take.

## What is in it

| group | controls |
|---|---|
| actions | `Button`, `IconButton`, `Menu`, `MenuItem`, `CommandMenu`, `KeyHint` |
| input | `Field`, `NumberField`, `DecimalField`, `DurationField`, `DatePicker`, `DateTimePicker`, `Dropdown`, `SearchPicker`, `RadioGroup`, `Checkbox`, `Option`, `SearchField` |
| overlays | `Dialog`, `Backdrop`, `Scrim`, `ShellSheet`, `KeyboardSheet`, `AssistantPanel` |
| data | `DataGrid` (selectable, with a selection toolbar, and Load more), `LoadMoreButton`, `SelectionBar`, `FilterChip`, `Card`, `Metric`, `Badge`, `RecordBadge`, `RecordPanel`, `ListRow` |
| feedback | `Alert`, `Done`, `EmptyState`, `ProgressBar`, `Spinner`, `Skeleton`, `SaveBar`, `SaveActions`, `AutoSave`, `LeavePrompt`, `Lamp` |
| settings | `SettingsArea`, `SettingsPage`, `SettingsSection`, `SettingRow`, `SettingsOverview` |
| shells | `SidebarShell`, `RailShell`, `TabbedShell`, `WorkbenchShell`, `FocusedShell`, `SplitShell`, `CatalogueShell`, `EditorialShell`, `MarqueeShell`, `StorefrontShell` |
| page arrangements | `Dock` (right and bottom drawers), `SubNav`, `Paper`, `WidgetGrid`, `Widget` |
| typography | `PageHead`, `PageTitle`, `CardTitle`, `SectionLabel`, `FieldLabel`, `Hint`, `Strong` |
| media | `AmbientVideo` — a background film with its own pause |
| codes | `QrCode` — a QR code a phone can scan, dark on white whatever the theme |

Its words are translated (`locales/`), and every control is keyboard-reachable and labelled for a screen reader.

## Source and package

- Source: one `.osy` file per group in this folder (`Button.osy`, `DataGrid.osy`, `Shell.Sidebar.osy`, …), the default
  theme in `theme.osy`.
- Tests: `tests/`.
- Package: `use Osysharp.Ui@3;` — the CLI carries the current release, and `osy lock` fetches any other from this
  repository's releases.

To build your own look on top of it, declare a `theme` in your app — its tokens re-skin every control. To change a
control itself, copy its file into your app or into a package of your own, rename the component, and use yours.

## Examples

Taken from this package's own tests, which compile and run on every release.

```osy
[Test]
void a_danger_icon_button_asks_before_it_acts() {
  Ui.Visit("/offcuts");
  Ui.Click("Scrap Oak, 40cm");
  Assert.Dialog("Scrap Oak, 40cm?");
  Assert.Visible("3 offcuts");              // nothing has happened yet

  Ui.Click("Cancel");
  Assert.Visible("Oak, 40cm");
  Assert.Visible("3 offcuts");

  Ui.Click("Scrap Oak, 40cm");
  Ui.Click("Scrap Oak, 40cm", within: "Scrap Oak, 40cm?");
  Assert.Hidden("Oak, 40cm");
  Assert.Visible("2 offcuts");
}
```

From [`tests/ask-first.test.osy`](tests/ask-first.test.osy).

```osy
[Test(Mats)]
void a_held_save_says_what_is_wrong_under_the_field() {
  Ui.SignInAs(Tom);
  Ui.Visit("/mats/" + MatCoded("IVO-2"));
  Ui.Fill("Name", "");
  Ui.Click("Save");
  Assert.Visible("1 field needs attention.");
  Assert.TextIs("A mat needs a name.");
  Assert.Violation("Name", "A mat needs a name.");
}
```

From [`tests/field-messages.test.osy`](tests/field-messages.test.osy).

```osy
[Test(ShelvedStock)]
void a_grid_whose_columns_cannot_be_sorted_keeps_the_pages_order() {
  Moulding? walnut = null;
  Moulding? ash = null;
  runas (ShelfPia) {
    walnut = Moulding.Single(m => m.Moniker == "Walnut");
    ash = Moulding.Single(m => m.Moniker == "Ash");
  }
  Ui.SignInAs(ShelfPia);
  Ui.Visit("/stock/by-shelf");
  Assert.Before(walnut, ash);
}
```

From [`tests/grid-order.test.osy`](tests/grid-order.test.osy).

## Learn more

- [The Osysharp.Ui reference](https://osysharp.com/reference/ui/kit/)
- [Osysharp.Ui in the package catalogue](https://osysharp.com/packages/#osysharp-ui)
- [The Osy# reference](https://osysharp.com/reference/) — the language, the runtime and every kit
- [`llms-full.txt`](https://osysharp.com/llms-full.txt) — the whole reference and specification as one Markdown file, for a coding agent

## Licence

MIT — see [`LICENSE`](LICENSE).
