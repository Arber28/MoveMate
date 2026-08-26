import { Fragment, useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";


type Position = {
  id: number;
  title: string;
  price: number;
  paid_price: number | null;
  status: "offen" | "gekauft";
  room: string;
  priority: string;
};

type Props = {
  positions: Position[];
  status: "offen" | "gekauft";
};

const priorities = ["P3", "P2", "P1", "P0"];

export default function PivotTable({
  positions,
  status,
}: Props) {
  const [openRooms, setOpenRooms] = useState<string[]>([]);

  const toggleRoom = (room: string) => {
    if (openRooms.includes(room)) {
      setOpenRooms(openRooms.filter((r) => r !== room));
    } else {
      setOpenRooms([...openRooms, room]);
    }
  };

  const filtered = positions.filter(
    (p) => p.status === status
  );

  const rooms = [...new Set(filtered.map((p) => p.room))];

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">

      <table className="w-full table-fixed text-[9px]">

        <thead>

          <tr className="border-b border-zinc-800 bg-zinc-950">

            <th className="w-28 px-2 py-2 text-left">
              {status === "offen"
                ? "Offen"
                : "Gekauft"}
            </th>

            {priorities.map((prio) => (
              <th
                key={prio}
                className="w-10 px-1 py-2 text-center"
              >
                {prio}
              </th>
            ))}

            <th className="w-14 px-1 py-2 text-center">
              Gesamt
            </th>

          </tr>

        </thead>

        <tbody>

          {rooms.map((room) => {

            const roomItems = filtered.filter(
              (p) => p.room === room
            );

            const isOpen =
              openRooms.includes(room);

            const roomTotal = roomItems.reduce(
              (sum, item) =>
                sum +
                (item.paid_price ??
                  item.price),
              0
            );

            return (
              <Fragment key={room}>
                <tr
                  key={room}
                  onClick={() =>
                    toggleRoom(room)
                  }
                  className="cursor-pointer border-b border-zinc-800 bg-zinc-800 hover:bg-zinc-700"
                >

                  <td className="px-2 py-2 font-semibold">

                    <div className="flex items-center gap-2">

                      {isOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}

                      {room}

                    </div>

                  </td>

                  {priorities.map((prio) => {

                    const total =
                      roomItems
                        .filter(
                          (i) =>
                            i.priority ===
                            prio
                        )
                        .reduce(
                          (s, i) =>
                            s +
                            (i.paid_price ??
                              i.price),
                          0
                        );

                    return (
                      <td
                        key={prio}
                        className="text-center font-semibold"
                      >
                        {total > 0
                          ? `${total.toFixed(
                              0
                            )}€`
                          : ""}
                      </td>
                    );
                  })}

                  <td className="text-center font-bold text-violet-400">
                    {roomTotal.toFixed(0)}€
                  </td>

                </tr>

                                {isOpen &&
                  roomItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-zinc-800 bg-zinc-900"
                    >
                      <td className="pl-10 pr-2 py-2 truncate text-zinc-300">
                        {item.title}
                      </td>

                      {priorities.map((prio) => (
                        <td
                          key={prio}
                          className="text-center text-zinc-200"
                        >
                          {item.priority === prio
                            ? `${(
                                item.paid_price ??
                                item.price
                              ).toFixed(0)}€`
                            : ""}
                        </td>
                      ))}

                      <td className="text-center font-semibold text-violet-400">
                        {(
                          item.paid_price ??
                          item.price
                        ).toFixed(0)}
                        €
                      </td>
                    </tr>
                  ))}

              </Fragment>
            );
          })}

        </tbody>

        <tr className="border-t-2 border-zinc-700 bg-zinc-950 font-bold">

  <td className="px-2 py-3">
    Gesamtergebnis
  </td>

  {priorities.map((prio) => {
    const total = filtered
      .filter((i) => i.priority === prio)
      .reduce(
        (sum, i) => sum + (i.paid_price ?? i.price),
        0
      );

    return (
      <td
        key={prio}
        className="text-center"
      >
        {total > 0 ? `${total.toFixed(0)}€` : ""}
      </td>
    );
  })}

  <td className="text-center text-violet-400">
    {filtered
      .reduce(
        (sum, i) => sum + (i.paid_price ?? i.price),
        0
      )
      .toFixed(0)}
    €
  </td>

</tr>

      </table>

    </div>
  );
}