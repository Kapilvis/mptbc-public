declare namespace Controls {
  interface CardOverView {
    title: string;
    value: string;
    subtitle?: string;
    icon: import("react").ReactNode;
    iconClassName?: string;
  }

  interface OverviewCardsProps {
    items: CardOverView[];
  }
}
