import { ComponentProps } from 'react'

export const QuoteVector = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      width="35"
      height="31"
      viewBox="0 0 35 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.0833 1.646C4.31507 5.71791 0.243164 12.391 0.243164 19.7427C0.243164 25.7374 3.8625 29.2437 8.04744 29.2437C12.0061 29.2437 14.9468 26.0767 14.9468 22.3441C14.9468 18.6118 12.3454 15.8973 8.95233 15.8973C8.27372 15.8973 7.36882 16.0103 7.14254 16.1234C7.70813 12.278 11.3275 7.75374 14.9471 5.49162L10.0833 1.646ZM29.5374 1.646C23.882 5.71791 19.8104 12.391 19.8104 19.7427C19.8104 25.7374 23.4297 29.2437 27.6146 29.2437C31.4602 29.2437 34.514 26.0767 34.514 22.3441C34.514 18.6118 31.7996 15.8973 28.4063 15.8973C27.7276 15.8973 26.936 16.0103 26.7097 16.1234C27.2753 12.278 30.7816 7.75374 34.401 5.49162L29.5374 1.646Z"
        stroke="#F1F5F9"
        strokeWidth="2"
      />
    </svg>
  )
}