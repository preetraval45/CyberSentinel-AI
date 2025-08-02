'use client'

import { motion } from 'framer-motion'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/solid'
import { Fragment } from 'react'

interface Company {
  id: string
  name: string
  industry: string
  size: string
  logo: string
}

interface CompanyAssignmentProps {
  selected: Company | null
  onChange: (company: Company) => void
}

const companies: Company[] = [
  { id: 'techcorp', name: 'TechCorp Industries', industry: 'Technology', size: 'Enterprise', logo: '🏢' },
  { id: 'financeplus', name: 'FinancePlus Bank', industry: 'Financial', size: 'Large', logo: '🏦' },
  { id: 'healthsys', name: 'HealthSys Medical', industry: 'Healthcare', size: 'Medium', logo: '🏥' },
  { id: 'edutech', name: 'EduTech Solutions', industry: 'Education', size: 'Small', logo: '🎓' },
  { id: 'retailmax', name: 'RetailMax Chain', industry: 'Retail', size: 'Large', logo: '🛒' },
]

export default function CompanyAssignment({ selected, onChange }: CompanyAssignmentProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-cyber font-bold neon-text mb-2">Company Assignment</h3>
        <p className="text-cyber-primary/70">Select your organization</p>
      </div>

      <div className="relative">
        <Listbox value={selected} onChange={onChange}>
          <Listbox.Button className="cyber-input w-full text-left flex items-center justify-between">
            <span className="flex items-center space-x-3">
              {selected ? (
                <>
                  <span className="text-2xl">{selected.logo}</span>
                  <div>
                    <p className="font-cyber font-bold">{selected.name}</p>
                    <p className="text-sm text-cyber-primary/70">{selected.industry} • {selected.size}</p>
                  </div>
                </>
              ) : (
                <span className="text-cyber-primary/50">Select a company...</span>
              )}
            </span>
            <ChevronUpDownIcon className="h-5 w-5 text-cyber-primary/50" />
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-2 w-full glass-dark rounded-lg border border-cyber-primary/30 max-h-60 overflow-auto">
              {companies.map((company) => (
                <Listbox.Option
                  key={company.id}
                  value={company}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-3 px-4 ${
                      active ? 'bg-cyber-primary/10 text-cyber-primary' : 'text-cyber-primary/80'
                    }`
                  }
                >
                  {({ selected: isSelected }) => (
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{company.logo}</span>
                        <div>
                          <p className={`font-cyber font-bold ${isSelected ? 'text-cyber-primary' : ''}`}>
                            {company.name}
                          </p>
                          <p className="text-sm text-cyber-primary/70">
                            {company.industry} • {company.size}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckIcon className="h-5 w-5 text-cyber-primary" />
                      )}
                    </motion.div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>
      </div>
    </div>
  )
}