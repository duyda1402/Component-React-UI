import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  Group,
  Popover,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";

type RowData = {
  label: string;
  id: string;
  data: Record<
    string,
    {
      value: any;
      type: "date" | "string" | "checkbox" | "date-range";
    }
  >;
};
type ColData = {
  label: string;
  id: string;
  dataIndex: string;
};

function SummaryComponent() {
  //Data Calender
  const [calendar, setCalendar] = useState<Array<Date>>([]);
  const [curMonth, setCurMonth] = useState<number>(new Date().getMonth());
  const [curYear, setCurYear] = useState<number>(new Date().getFullYear());
  const [rows, setRows] = useState<Array<RowData>>([
    {
      label: "Destination",
      id: "destination",
      data: {
        $title: {
          value: "Bali",
          type: "string",
        },
      },
    },
    {
      label: "Today",
      id: "today",
      data: {
        $title: {
          value: new Date("2023-11-08"),
          type: "date",
        },
      },
    },
    {
      label: "Duration",
      id: "duration",
      data: {
        $title: {
          value: {
            startDate: new Date("2023-11-01"),
            endDate: new Date("2023-11-28"),
          },
          type: "date-range",
        },
      },
    },
  ]);
  const [cols, setCols] = useState<Array<ColData>>([
    {
      label: "Title 1",
      id: "row1",
      dataIndex: "$title",
    },
  ]);
  //

  const { control, setValue, getValues } = useForm<{
    cols: ColData[];
    rows: RowData[];
  }>();

  const [isEdit, setIsEdit] = useState(false);
  //Effect Calender
  useEffect(() => {
    const getFullDay = () => {
      const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
      const calendarDates = [];

      const firstDay = new Date(curYear, curMonth, 1);
      const lastDay = new Date(curYear, curMonth, daysInMonth);

      const startDay = new Date(firstDay);
      startDay.setDate(startDay.getDate() - startDay.getDay());

      const endDay = new Date(lastDay);
      endDay.setDate(endDay.getDate() + (6 - endDay.getDay()));

      let currentDay = new Date(startDay);

      while (currentDay <= endDay) {
        calendarDates.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
      }
      setCalendar(calendarDates);
    };
    getFullDay();
  }, [curMonth, curYear]);

  const IconDelete = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-x"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
  const handlerDeleteRow = () => {};
  const handlerDeleteCol = () => {};
  const handlerAddRow = () => {};
  const handlerAddCol = () => {};
  const handlerSubmit = () => {
    const values = getValues();
    setCols(values.cols);
    setRows(values.rows);
    setIsEdit(false);
  };

  return (
    <Box
      p="md"
      sx={(theme) => ({
        borderWidth: 1,
        borderColor: theme.colors.gray[3],
        borderStyle: "solid",
        borderRadius: theme.radius.md,
      })}
    >
      {/* Body Data */}
      <Stack spacing={4}>
        {isEdit && (
          <Card.Section inheritPadding py="xs">
            <SimpleGrid cols={cols.length + 1}>
              <Group position="left">
                <Button
                  variant="subtle"
                  size="sm"
                  compact
                  onClick={handlerAddRow}
                >
                  + row
                </Button>
                <Button
                  variant="subtle"
                  size="sm"
                  compact
                  onClick={handlerAddCol}
                >
                  + col
                </Button>
              </Group>
              {cols.map((col) => (
                <Group key={col.id} position="right">
                  <Text fw={500} fz="sm" color="gray.7">
                    {col.label}
                  </Text>
                  <ActionIcon color="red" size="xs" onClick={handlerDeleteCol}>
                    {IconDelete}
                  </ActionIcon>
                </Group>
              ))}
            </SimpleGrid>
          </Card.Section>
        )}
        {/* Row View */}
        {rows.map((row, indexRow: number) => (
          <Card.Section
            key={row.id}
            inheritPadding
            py="xs"
            onDoubleClick={() => {
              setValue("cols", cols);
              setValue("rows", rows);
              setIsEdit(true);
            }}
          >
            <SimpleGrid cols={cols.length + 1} key={row.id}>
              {/* Title Row */}
              <Group>
                {isEdit && (
                  <ActionIcon color="red" size="xs" onClick={handlerDeleteRow}>
                    {IconDelete}
                  </ActionIcon>
                )}
                <Text>{row.label}</Text>
              </Group>

              {/* Value Row */}
              {Object.keys(row.data).map((key: string) => (
                <Group position="right" noWrap align="start" key={key}>
                  {/* View and Edit fiend String */}
                  {row.data[key]?.type === "string" && (
                    <>
                      {isEdit ? (
                        <Controller
                          name={`rows.${indexRow}.data.${key}.value`}
                          control={control}
                          rules={{
                            required: true,
                          }}
                          render={({ field: { onChange, value } }) => (
                            <TextInput
                              variant="filled"
                              placeholder="Enter"
                              value={value}
                              onChange={onChange}
                            />
                          )}
                        />
                      ) : (
                        <Text>{row.data[key]?.value}</Text>
                      )}
                    </>
                  )}

                  {/* View and Edit fiend Date */}
                  {row.data[key]?.type === "date" && (
                    <>
                      {/* DatePicker */}
                      {isEdit ? (
                        <Controller
                          name={`rows.${indexRow}.data.${key}.value`}
                          control={control}
                          rules={{
                            required: true,
                          }}
                          render={({ field: { onChange, value } }) => (
                            <Popover
                              width="18rem"
                              position="bottom"
                              withArrow
                              shadow="md"
                              closeOnClickOutside
                              closeOnEscape
                            >
                              <Popover.Target>
                                <TextInput
                                  variant="filled"
                                  value={
                                    value
                                      ? new Date(
                                          String(value)
                                        ).toLocaleDateString()
                                      : ""
                                  }
                                />
                              </Popover.Target>
                              <Popover.Dropdown>
                                <Stack sx={{ overflow: "hidden" }}>
                                  <Group noWrap position="apart">
                                    <ActionIcon
                                      variant="subtle"
                                      color="gray"
                                      onClick={() => {
                                        if (curMonth === 0) {
                                          setCurYear((pre) => pre - 1);
                                          setCurMonth(11);
                                        } else {
                                          setCurMonth((pre) => pre - 1);
                                        }
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon icon-tabler icon-tabler-chevron-left"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      >
                                        <path
                                          stroke="none"
                                          d="M0 0h24v24H0z"
                                          fill="none"
                                        />
                                        <path d="M15 6l-6 6l6 6" />
                                      </svg>
                                    </ActionIcon>
                                    <Select
                                      w={200}
                                      searchable
                                      variant="unstyled"
                                      value={curMonth.toString()}
                                      onChange={(value) =>
                                        setCurMonth(Number(value))
                                      }
                                      data={[
                                        { value: "0", label: "Jan" },
                                        { value: "1", label: "Feb" },
                                        { value: "2", label: "Mar" },
                                        { value: "3", label: "Apr" },
                                        { value: "4", label: "May" },
                                        { value: "5", label: "Jun" },
                                        { value: "6", label: "Jul" },
                                        { value: "7", label: "Aug" },
                                        { value: "8", label: "Sep" },
                                        { value: "9", label: "Oct" },
                                        { value: "10", label: "Nov" },
                                        { value: "11", label: "Dec" },
                                      ]}
                                    />
                                    <Select
                                      w={200}
                                      variant="unstyled"
                                      searchable
                                      value={curYear.toString()}
                                      onChange={(value) =>
                                        setCurYear(Number(value))
                                      }
                                      data={new Array(100)
                                        .fill(0)
                                        .map((_, index) => ({
                                          value: `${1970 + index}`,
                                          label: `${1970 + index}`,
                                        }))}
                                    />
                                    <ActionIcon
                                      variant="subtle"
                                      color="gray"
                                      onClick={() => {
                                        if (curMonth === 11) {
                                          setCurYear((pre) => pre + 1);
                                          setCurMonth(0);
                                        } else {
                                          setCurMonth((pre) => pre + 1);
                                        }
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon icon-tabler icon-tabler-chevron-right"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      >
                                        <path
                                          stroke="none"
                                          d="M0 0h24v24H0z"
                                          fill="none"
                                        />
                                        <path d="M9 6l6 6l-6 6" />
                                      </svg>
                                    </ActionIcon>
                                  </Group>

                                  <SimpleGrid
                                    cols={7}
                                    sx={{ cursor: "pointer" }}
                                  >
                                    {[
                                      "Mon",
                                      "Tue",
                                      "Wed",
                                      "Thu",
                                      "Fri",
                                      "Sat",
                                      "Sun",
                                    ].map((week, index) => (
                                      <Text
                                        fz="sm"
                                        fw={500}
                                        color="gray"
                                        key={index}
                                      >
                                        {week}
                                      </Text>
                                    ))}
                                  </SimpleGrid>
                                  <Stack spacing="xs">
                                    {new Array(5).fill(0).map((_, indexRow) => {
                                      const days = calendar.slice(
                                        indexRow * 7,
                                        (indexRow + 1) * 7
                                      );
                                      return (
                                        <SimpleGrid
                                          cols={7}
                                          spacing={2}
                                          key={`col-${indexRow}`}
                                        >
                                          {days.map((day, index) => (
                                            <Center
                                              w="100%"
                                              key={index}
                                              onClick={() => onChange(day)}
                                              bg={
                                                new Date(
                                                  String(value)
                                                ).toDateString() ===
                                                day.toDateString()
                                                  ? "blue"
                                                  : undefined
                                              }
                                              h={28}
                                              sx={(theme) => ({
                                                cursor: "pointer",
                                                borderRadius: theme.radius.xs,
                                              })}
                                            >
                                              <Text
                                                fz="sm"
                                                fw={500}
                                                ta="center"
                                                color={
                                                  new Date(
                                                    String(value)
                                                  ).toDateString() ===
                                                  day.toDateString()
                                                    ? "white"
                                                    : day.getMonth() ===
                                                      curMonth
                                                    ? "gray.8"
                                                    : "gray.5"
                                                }
                                              >
                                                {day.getDate()}
                                              </Text>
                                            </Center>
                                          ))}
                                        </SimpleGrid>
                                      );
                                    })}
                                  </Stack>
                                </Stack>
                              </Popover.Dropdown>
                            </Popover>
                          )}
                        />
                      ) : (
                        <Text color="gray.7" fz="sm">
                          {row.data[key]?.value.toLocaleDateString()}
                        </Text>
                      )}
                    </>
                  )}

                  {/* View and Edit fiend Date-Range */}
                  {row.data[key]?.type === "date-range" && (
                    <>
                      {/* DateRangePicker */}
                      {isEdit ? (
                        <Controller
                          name={`rows.${indexRow}.data.${key}.value`}
                          control={control}
                          rules={{
                            required: true,
                          }}
                          render={({ field: { onChange, value } }) => (
                            <Popover
                              width="18rem"
                              position="bottom"
                              withArrow
                              shadow="md"
                              closeOnClickOutside
                              closeOnEscape
                            >
                              <Popover.Target>
                                <TextInput
                                  variant="filled"
                                  value={
                                    value
                                      ? `${
                                          new Date(
                                            String(value["startDate"])
                                          ).toLocaleDateString() || ""
                                        } - ${
                                          new Date(
                                            String(value["endDate"])
                                          ).toLocaleDateString() || ""
                                        }`
                                      : ""
                                  }
                                />
                              </Popover.Target>
                              <Popover.Dropdown>
                                <Stack sx={{ overflow: "hidden" }}>
                                  {/* Header Calender */}
                                  <Group noWrap position="apart">
                                    <ActionIcon
                                      variant="subtle"
                                      color="gray"
                                      onClick={() => {
                                        if (curMonth === 0) {
                                          setCurYear((pre) => pre - 1);
                                          setCurMonth(11);
                                        } else {
                                          setCurMonth((pre) => pre - 1);
                                        }
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon icon-tabler icon-tabler-chevron-left"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      >
                                        <path
                                          stroke="none"
                                          d="M0 0h24v24H0z"
                                          fill="none"
                                        />
                                        <path d="M15 6l-6 6l6 6" />
                                      </svg>
                                    </ActionIcon>
                                    <Select
                                      w={200}
                                      searchable
                                      variant="unstyled"
                                      value={curMonth.toString()}
                                      onChange={(value) =>
                                        setCurMonth(Number(value))
                                      }
                                      data={[
                                        { value: "0", label: "Jan" },
                                        { value: "1", label: "Feb" },
                                        { value: "2", label: "Mar" },
                                        { value: "3", label: "Apr" },
                                        { value: "4", label: "May" },
                                        { value: "5", label: "Jun" },
                                        { value: "6", label: "Jul" },
                                        { value: "7", label: "Aug" },
                                        { value: "8", label: "Sep" },
                                        { value: "9", label: "Oct" },
                                        { value: "10", label: "Nov" },
                                        { value: "11", label: "Dec" },
                                      ]}
                                    />
                                    <Select
                                      w={200}
                                      variant="unstyled"
                                      searchable
                                      value={curYear.toString()}
                                      onChange={(value) =>
                                        setCurYear(Number(value))
                                      }
                                      data={new Array(100)
                                        .fill(0)
                                        .map((_, index) => ({
                                          value: `${1970 + index}`,
                                          label: `${1970 + index}`,
                                        }))}
                                    />
                                    <ActionIcon
                                      variant="subtle"
                                      color="gray"
                                      onClick={() => {
                                        if (curMonth === 11) {
                                          setCurYear((pre) => pre + 1);
                                          setCurMonth(0);
                                        } else {
                                          setCurMonth((pre) => pre + 1);
                                        }
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon icon-tabler icon-tabler-chevron-right"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      >
                                        <path
                                          stroke="none"
                                          d="M0 0h24v24H0z"
                                          fill="none"
                                        />
                                        <path d="M9 6l6 6l-6 6" />
                                      </svg>
                                    </ActionIcon>
                                  </Group>
                                  <SimpleGrid
                                    cols={7}
                                    sx={{ cursor: "pointer" }}
                                  >
                                    {[
                                      "Mon",
                                      "Tue",
                                      "Wed",
                                      "Thu",
                                      "Fri",
                                      "Sat",
                                      "Sun",
                                    ].map((week, index) => (
                                      <Text
                                        fz="sm"
                                        fw={500}
                                        color="gray"
                                        key={index}
                                      >
                                        {week}
                                      </Text>
                                    ))}
                                  </SimpleGrid>
                                  {/* Picker Range Date */}
                                  <Stack spacing="xs">
                                    {new Array(5).fill(0).map((_, indexRow) => {
                                      const days = calendar.slice(
                                        indexRow * 7,
                                        (indexRow + 1) * 7
                                      );
                                      return (
                                        <SimpleGrid
                                          cols={7}
                                          spacing={2}
                                          key={`col-${indexRow}`}
                                        >
                                          {days.map((day, index) => {
                                            const startDate = value["startDate"]
                                              ? new Date(
                                                  String(value["startDate"])
                                                )
                                              : undefined;
                                            const endDate = value["endDate"]
                                              ? new Date(
                                                  String(value["endDate"])
                                                )
                                              : undefined;
                                            return (
                                              <Center
                                                w="100%"
                                                key={index}
                                                onClick={() => {
                                                  if (!startDate) {
                                                    onChange({
                                                      startDate: startDate,
                                                    });
                                                  } else if (!endDate) {
                                                    if (startDate > day) {
                                                      onChange({
                                                        startDate: day,
                                                        endDate: startDate,
                                                      });
                                                    } else {
                                                      onChange({
                                                        startDate: startDate,
                                                        endDate: day,
                                                      });
                                                    }
                                                  } else {
                                                    onChange({
                                                      startDate: day,
                                                      endDate: undefined,
                                                    });
                                                  }
                                                }}
                                                bg={
                                                  startDate?.toDateString() ===
                                                    day.toDateString() ||
                                                  endDate?.toDateString() ===
                                                    day.toDateString()
                                                    ? "blue"
                                                    : endDate &&
                                                      startDate &&
                                                      day < endDate &&
                                                      day > startDate
                                                    ? "blue.1"
                                                    : undefined
                                                }
                                                h={28}
                                                sx={(theme) => ({
                                                  cursor: "pointer",
                                                  borderRadius: theme.radius.xs,
                                                })}
                                              >
                                                <Text
                                                  fz="sm"
                                                  fw={500}
                                                  ta="center"
                                                  color={
                                                    endDate?.toDateString() ===
                                                      day.toDateString() ||
                                                    startDate?.toDateString() ===
                                                      day.toDateString()
                                                      ? "white"
                                                      : day.getMonth() ===
                                                        curMonth
                                                      ? "gray.8"
                                                      : "gray.5"
                                                  }
                                                >
                                                  {day.getDate()}
                                                </Text>
                                              </Center>
                                            );
                                          })}
                                        </SimpleGrid>
                                      );
                                    })}
                                  </Stack>
                                </Stack>
                              </Popover.Dropdown>
                            </Popover>
                          )}
                        />
                      ) : (
                        <Stack spacing={4} align="flex-end">
                          <Text fz="sm">
                            {(new Date(
                              row.data[key]?.value?.endDate
                            ).getTime() -
                              new Date(
                                row.data[key]?.value?.startDate
                              ).getTime()) /
                              (1000 * 3600 * 24)}{" "}
                            days
                          </Text>
                          <Text color="gray.7" fz="xs">
                            {new Date(
                              row.data[key]?.value?.startDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              row.data[key]?.value?.endDate
                            ).toLocaleDateString()}
                          </Text>
                        </Stack>
                      )}
                    </>
                  )}
                </Group>
              ))}
            </SimpleGrid>
          </Card.Section>
        ))}
      </Stack>
      {isEdit && (
        <Group position="right" mt="sm">
          <Button
            variant="subtle"
            color="gray"
            compact
            onClick={() => setIsEdit(false)}
          >
            Cancel
          </Button>
          <Button variant="subtle" color="blue" compact onClick={handlerSubmit}>
            Save
          </Button>
        </Group>
      )}
    </Box>
  );
}
export default SummaryComponent;
