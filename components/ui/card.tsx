import * as React from "react"

export function Card({children, className}:{children:React.ReactNode, className?: string}){
    return(
        <div className={`rounded-lg border border-b-indigo-300 bg-white/70 shadow ${className || ''}`}>
            {children}
        </div>
    )
}
export function CardHeader({children, className}:{children:React.ReactNode, className?: string}){
    return(
        <div className={`rounded-lg border border-b-indigo-300 bg-white/70 shadow ${className || ''}`}>
            {children}
        </div>
    )
}
export function CardTitle({children, className}:{children:React.ReactNode, className?: string}){
    return(
        <div className={`rounded-lg border border-b-indigo-300 bg-white/70 shadow ${className || ''}`}>
            {children}
        </div>
    )
}
export function CardDescription({children, className}:{children:React.ReactNode, className?: string}){
    return(
        <div className={`rounded-lg border border-b-indigo-300 bg-white/70 shadow ${className || ''}`}>
            {children}
        </div>
    )
}
export function CardContent({children, className}:{children:React.ReactNode, className?: string}){
    return(
        <div className={`rounded-lg border border-b-indigo-300 bg-white/70 shadow ${className || ''}`}>
            {children}
        </div>
    )
}
