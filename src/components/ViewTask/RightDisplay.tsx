import { FC, Fragment } from 'react'
import { Tab } from '@headlessui/react'
import StatementTab from './Tabs/StatementTab'
import SubmitTab from './Tabs/SubmitTab'
import MySubmissionsTab from './Tabs/MySubmissionsTab'
import SubmissionsTab from './Tabs/SubmissionsTab'
import SolutionTab from './Tabs/SolutionTab'

export const RightDisplay: FC = () => {
  return (
    <div className="w-full flex flex-col gap-8">
      <Tab.Panels as={Fragment}>
        <Tab.Panel>
          <StatementTab />
        </Tab.Panel>
        <Tab.Panel>
          <SubmitTab />
        </Tab.Panel>
        <Tab.Panel>
          <SubmissionsTab />
        </Tab.Panel>
        <Tab.Panel>
          <MySubmissionsTab />
        </Tab.Panel>
        <Tab.Panel>
          <SolutionTab />
        </Tab.Panel>
      </Tab.Panels>
    </div>
  )
}