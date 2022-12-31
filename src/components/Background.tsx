import { SVGProps } from 'react'

function Background({ color, ...props }: { color: string } & SVGProps<SVGRectElement>) {
    return <rect rx={14} fill={color} {...props} />
}

export default Background
