import { Bell, BellOff, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { ScheduleItem } from "../types";

interface UpcomingTimelineProps {
  schedule: ScheduleItem[];
  reminders: string[];
  toggleReminder: (id: string) => void;
}

export default function UpcomingTimeline({
  schedule,
  reminders,
  toggleReminder,
}: UpcomingTimelineProps) {
  return (
    <section id="schedule" className="scroll-mt-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-brand-purple" />
          <h2 className="font-display font-bold text-xl text-white tracking-tight">
            Upcoming Schedule
          </h2>
          <span className="text-xs bg-[#171726] text-[#9070db] px-2.5 py-0.5 rounded-full font-mono border border-brand-purple/20 font-bold">
            TIMELINE
          </span>
        </div>
        <p className="text-xs text-gray-400 hidden sm:block font-sans">
          Scroll horizontally to see later schedules →
        </p>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar -mx-1 snap-x scroll-smooth">
        {schedule.map((item, index) => {
          const hasReminder = reminders.includes(item.id);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex-shrink-0 w-[280px] sm:w-[320px] bg-brand-card rounded-xl border border-[#232333] hover:border-brand-purple/40 p-4 snap-start relative group flex flex-col justify-between transition-all duration-300"
            >
              {/* Card Header: Avatar & Channel Name & Start Time */}
              <div className="flex items-center justify-between gap-2.5 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={item.avatar}
                    alt={item.channelName}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-brand-purple/30"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-300 truncate font-sans">
                      {item.channelName}
                    </p>
                    <p className="text-[10px] text-gray-500 font-sans truncate">
                      {item.topic}
                    </p>
                  </div>
                </div>

                {/* Relative Start Time Badge */}
                <div className="bg-[#171726] border border-brand-purple/20 px-2 py-0.5 rounded text-[10px] font-bold text-brand-purple font-mono whitespace-nowrap">
                  {item.startTime}
                </div>
              </div>

              {/* Card Body: Stream Title */}
              <div className="flex-1">
                <h3 className="text-xs text-gray-200 font-sans font-medium line-clamp-2 leading-relaxed mb-4 min-h-[36px]">
                  {item.title}
                </h3>
              </div>

              {/* Card Action: Set Reminder */}
              <div className="flex items-center justify-between pt-2.5 border-t border-[#252535]">
                <span className="text-[10px] text-gray-400 font-sans">
                  Starts {item.startTime}
                </span>

                <button
                  onClick={() => toggleReminder(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all duration-200 font-sans cursor-pointer ${
                    hasReminder
                      ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20"
                      : "bg-[#1f1f2e] text-gray-400 hover:text-white hover:bg-brand-purple/10 hover:border-brand-purple/20 border border-transparent"
                  }`}
                >
                  {hasReminder ? (
                    <>
                      <BellOff className="w-3.5 h-3.5" />
                      <span>Reminder Set</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5" />
                      <span>Notify Me</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
