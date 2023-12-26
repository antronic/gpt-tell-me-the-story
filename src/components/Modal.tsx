import { useEffect, useState, Children, cloneElement } from 'react'

// Interface Props
interface IProps extends React.PropsWithChildren {
  title: string
  onClose: () => void
}

// Config Box - Main
const Modal: React.FC<IProps> = (props) => {
  const [isLoad, setIsLoad] = useState(false)

  useEffect(() => {
    setIsLoad(true)
  }, [])

  // const mapPropsToChilren = () => {
  //   return Children.map(props.children, (child) => {
  //     return cloneElement(child as React.ReactElement, {
  //       onClose: props.onClose,
  //     })
  //   })
  // }

  return (
    <div className="fixed w-full h-full top-0 left-0 bg-black bg-opacity-50 z-10 flex justify-center items-center">
      <div className={`
        rounded-lg bg-slate-500/75 backdrop-blur-lg text-slate-100 px-4 py-2
        ${isLoad ? 'opacity-100 -translate-y-0' : 'opacity-0 -translate-y-8'} transition-all
      `}>
        <h1 className="text-2xl font-bold">{props.title}</h1>

        <div className="w-5/6 h-[0.25px] bg-slate-200 my-2"/>

        {props.children}
      </div>
    </div>
  )
}

export default Modal