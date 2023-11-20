import {
  ActionIcon,
  Center,
  Grid,
  Group,
  Popover,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";

import { useEffect, useState } from "react";

export default function DatePicker() {
  const [calendar, setCalendar] = useState<Array<Date>>([]);
  const [curMonth, setCurMonth] = useState<number>(new Date().getMonth());
  const [curYear, setCurYear] = useState<number>(new Date().getFullYear());
  const [choicesDate, setChoicesDate] = useState<Date>(new Date());

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

  return (
    <>
      <Popover
        width="19rem"
        position="bottom"
        withArrow
        shadow="md"
        closeOnClickOutside
        closeOnEscape
      >
        <Popover.Target>
          <Group
            position="right"
            sx={(theme) => ({
              borderWidth: 0,
              borderBottomWidth: 1,
              borderColor: theme.colors.gray[3],
              borderStyle: "solid",
            })}
          >
            <TextInput
              variant="unstyled"
              value={choicesDate.toLocaleDateString()}
            />
          </Group>
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
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M15 6l-6 6l6 6" />
                </svg>
              </ActionIcon>
              <Select
                w={200}
                searchable
                variant="unstyled"
                value={curMonth.toString()}
                onChange={(value) => setCurMonth(Number(value))}
                data={[
                  { value: "0", label: "January" },
                  { value: "1", label: "February" },
                  { value: "2", label: "March" },
                  { value: "3", label: "April" },
                  { value: "4", label: "May" },
                  { value: "5", label: "June" },
                  { value: "6", label: "July" },
                  { value: "7", label: "August" },
                  { value: "8", label: "September" },
                  { value: "9", label: "October" },
                  { value: "10", label: "November" },
                  { value: "11", label: "December" },
                ]}
              />
              <Select
                w={150}
                variant="unstyled"
                searchable
                value={curYear.toString()}
                onChange={(value) => setCurYear(Number(value))}
                data={new Array(100).fill(0).map((_, index) => ({
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
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 6l6 6l-6 6" />
                </svg>
              </ActionIcon>
            </Group>

            <Grid grow>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (week, index) => (
                  <Grid.Col span="auto" key={index} w={40}>
                    <Text fz="sm" fw={500} color="gray.7">
                      {week}
                    </Text>
                  </Grid.Col>
                )
              )}
            </Grid>
            {new Array(5).fill(0).map((_, indexRow) => {
              const days = calendar.slice(indexRow * 7, (indexRow + 1) * 7);
              return (
                <Grid grow key={`col-${indexRow}`}>
                  {days.map((day, index) => (
                    <Grid.Col span="auto" key={index}>
                      <Center
                        onClick={() => setChoicesDate(day)}
                        bg={
                          choicesDate.toDateString() === day.toDateString()
                            ? "blue"
                            : undefined
                        }
                        w={28}
                        h={28}
                        sx={(theme) => ({
                          cursor: "pointer",
                          borderRadius: theme.radius.sm,
                        })}
                      >
                        <Text
                          fz="sm"
                          fw={500}
                          ta="center"
                          color={
                            choicesDate.toDateString() === day.toDateString()
                              ? "white"
                              : day.getMonth() === curMonth
                              ? "gray.8"
                              : "gray.5"
                          }
                        >
                          {day.getDate()}
                        </Text>
                      </Center>
                    </Grid.Col>
                  ))}
                </Grid>
              );
            })}
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </>
  );
}
