import React, { useState, useEffect } from 'react'
import { Table, Tag, Collapse } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { SliderValue } from 'antd/lib/slider'
import { PaginationConfig } from 'antd/lib/pagination'

import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios'

import { DesktopOnly, MobileOnly } from '../../design/Responsive'
import { FilterComponent, IFilter } from '../../components/tasks/Filter'

import { WhiteContainerWrapper } from '../../design/Atomics'
import { PageLayout } from '../../components/Layout'

const { Panel } = Collapse

interface ITask {
  problem_id: string
  author: string
  path: string
  url: string
  title: string
  time_limit: number
  memory_limit: number
  difficulty: number
  tags: ReadonlyArray<string>
  source: string
}
interface ITaskPage {
  currentPage: number
  currentPageSize: number | undefined
  searchWord: string
  searchTag: ReadonlyArray<string>
  searchDifficulty: ReadonlyArray<number>
  hideTag: boolean
}

export default () => {
  const { data } = useSWR(
    'https://asia-east2-grader-ef0b5.cloudfunctions.net/getAllTasks',
    axios
  )

  const [taskListState, setTaskListState] = useState<ITask[]>([])
  const [tagListState, setTagListState] = useState<string[]>([])
  const [taskPage, setTaskPage] = useState<ITaskPage>({
    currentPage: 1,
    currentPageSize: 20,
    searchWord: '',
    searchTag: [],
    searchDifficulty: [0, 10],
    hideTag: true
  })

  const router = useRouter()

  const setPage: (page: ITaskPage) => void = page => {
    setTaskPage(page)
  }

  useEffect(() => {
    const updateTask = () => {
      if (data) {
        const filteredEvents = data.data.filter(
          ({ problem_id, title, tags, difficulty }) => {
            const textLowerCase = taskPage.searchWord.toLowerCase()
            title = title.toLowerCase()
            const statusProblemID = problem_id
              .toLowerCase()
              .includes(textLowerCase)
            const statusTitle = title.toLowerCase().includes(textLowerCase)
            let isTag = true

            taskPage.searchTag.forEach(
              value => (isTag = isTag && tags.includes(value))
            )

            const difficultyStatus =
              difficulty >= taskPage.searchDifficulty[0] &&
              difficulty <= taskPage.searchDifficulty[1]

            return (statusProblemID || statusTitle) && isTag && difficultyStatus
          }
        )

        setTaskListState(filteredEvents)
      }
    }

    updateTask()
  }, [taskPage, data])

  useEffect(() => {
    let tagNow: string[] = []
    if (data) {
      data.data.forEach(val => {
        val.tags.forEach(tag => {
          tagNow.push(tag)
        })
      })
    }

    setTagListState(Array.from(new Set(tagNow)))
  }, [data])

  const handleSearch: (e: React.FormEvent<HTMLInputElement>) => void = e => {
    setPage({
      ...taskPage,
      searchWord: e.currentTarget.value
    })
  }

  const handleTag: (value: string[]) => void = value => {
    setPage({ ...taskPage, searchTag: value })
  }

  const handleDifficulty: (value: SliderValue) => void = value => {
    setPage({
      ...taskPage,
      searchDifficulty: value as number[]
    })
  }

  const handleHideTag: (check: boolean) => void = check => {
    setPage({
      ...taskPage,
      hideTag: check
    })
  }

  const columnsHideTag: ColumnProps<ITask>[] = [
    {
      title: 'Problem ID',
      dataIndex: 'problem_id',
      defaultSortOrder: 'ascend',
      sorter: (a: ITask, b: ITask) => a.problem_id.localeCompare(b.problem_id)
    },
    {
      title: 'Problem',
      dataIndex: 'title',
      defaultSortOrder: 'ascend',
      sorter: (a: ITask, b: ITask) => a.title.localeCompare(b.title)
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      defaultSortOrder: 'ascend',
      sorter: (a: ITask, b: ITask) => b.difficulty - a.difficulty
    },
    {
      title: 'Source',
      dataIndex: 'source'
    }
  ]

  const columnsTag: ColumnProps<ITask>[] = [
    ...columnsHideTag,
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: (tags: Array<string>) => (
        <span>
          {tags.map((tag: string) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </span>
      )
    }
  ]

  const CustomPagination: PaginationConfig = {
    showQuickJumper: true,
    showSizeChanger: true,
    defaultCurrent: taskPage.currentPage,
    defaultPageSize: taskPage.currentPageSize,
    onChange: (currentPage: number, currentPageSize: number | undefined) => {
      setPage({
        ...taskPage,
        currentPage,
        currentPageSize
      })
    },
    onShowSizeChange: (
      currentPage: number,
      currentPageSize: number | undefined
    ) => {
      setPage({
        ...taskPage,
        currentPage,
        currentPageSize
      })
    }
  }

  const tableConfig = {
    rowKey: (record: ITask) => record.problem_id,
    onRow: (record: ITask) => {
      return {
        onClick: () => {
          router.push('/tasks/' + record.problem_id)
        }
      }
    },
    scroll: { x: 100 },
    columns: (taskPage.hideTag ? columnsHideTag : columnsTag) as ColumnProps<
      ITask
    >[],
    pagination: CustomPagination,
    dataSource: taskListState,
    loading: !data
  }

  const filterProps: IFilter = {
    tagList: tagListState,
    searchWord: taskPage.searchWord,
    searchTag: taskPage.searchTag as string[],
    hideTag: taskPage.hideTag,
    searchDifficulty: taskPage.searchDifficulty as number[],
    handleSearch: handleSearch,
    handleTag: handleTag,
    handleDifficulty: handleDifficulty,
    handleHideTag: handleHideTag
  }

  return (
    <PageLayout>
      <WhiteContainerWrapper>
        <DesktopOnly>
          <FilterComponent {...filterProps} />
        </DesktopOnly>
        <MobileOnly>
          <Collapse bordered={false}>
            <Panel key="1" header="Filter">
              <FilterComponent {...filterProps} />
            </Panel>
          </Collapse>
        </MobileOnly>
        <Table {...tableConfig} />
      </WhiteContainerWrapper>
    </PageLayout>
  )
}