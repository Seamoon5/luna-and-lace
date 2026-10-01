import { storeConfig } from "../config/store";

export default function AnnouncementBar() {
  return (
    <div className="bg-charcoal text-ivory text-[11px] md:text-xs tracking-[0.12em] uppercase text-center py-2.5 px-4 font-body font-medium">
      <span className="opacity-90">{storeConfig.announcementText}</span>
    </div>
  );
}
