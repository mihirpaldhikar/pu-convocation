/*
 * Copyright (C) PU Convocation Management System Authors
 *
 * This software is owned by PU Convocation Management System Authors.
 * No part of the software is allowed to be copied or distributed
 * in any form. Any attempt to do so will be considered a violation
 * of copyright law.
 *
 * This software is protected by copyright law and international
 * treaties. Unauthorized copying or distribution of this software
 * is a violation of these laws and could result in severe penalties.
 */

import { JSX } from "react";

interface VenueMapProps {
  activeEnclosure: string;
}

export default function VenueMap({
  activeEnclosure,
}: VenueMapProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 430 603"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={"h-[500px] w-[350px] lg:h-[400px] lg:w-[400px]"}
    >
      <g id="Venue Map">
        <rect
          id="venue_boundry"
          x="0.5"
          y="0.5"
          width="429"
          height="601.912"
          rx="19.5"
          stroke="black"
        />
        <path
          id="stage"
          d="M51.5 0.5H387.5V61.0313C387.5 71.8009 378.77 80.5313 368 80.5313H71C60.2304 80.5313 51.5 71.8009 51.5 61.0313V0.5Z"
          fill="#F5F5F5"
          stroke="black"
        />
        <rect
          id="screen"
          x="91.5"
          y="6.28809"
          width="247"
          height="17.3285"
          rx="4.5"
          stroke="black"
        />
        <path
          id="entrance"
          d="M42.5 602.5V593C42.5 587.753 46.7533 583.5 52 583.5H113.031C118.278 583.5 122.531 587.753 122.531 593V602.5H42.5Z"
          fill="#F5F5F5"
          stroke="black"
        />
        <rect
          id="enclosure_1"
          x="51.5"
          y="194.5"
          width="336"
          height="44"
          rx="4.5"
          className={`${
            activeEnclosure === "1"
              ? "fill-red-500 stroke-red-700"
              : "fill-gray-100 stroke-gray-300"
          }`}
        />
        <path
          id="text_1"
          d="M215.058 220V211.04L216.038 212.02H213.098V210.2H217.326V220H215.058Z"
          className={`${
            activeEnclosure === "1" ? "fill-white" : "fill-gray-400"
          } `}
        />
        <rect
          id="enclosure_2"
          x="51.5"
          y="254.5"
          width="336"
          height="44"
          rx="9.5"
          className={`${
            activeEnclosure === "2"
              ? "fill-red-500 stroke-red-700"
              : "fill-gray-100 stroke-gray-300"
          }`}
        />
        <path
          id="text_2"
          d="M211.462 280V278.53L215.242 274.96C215.541 274.689 215.76 274.447 215.9 274.232C216.04 274.017 216.133 273.821 216.18 273.644C216.236 273.467 216.264 273.303 216.264 273.154C216.264 272.762 216.129 272.463 215.858 272.258C215.597 272.043 215.209 271.936 214.696 271.936C214.285 271.936 213.903 272.015 213.548 272.174C213.203 272.333 212.909 272.58 212.666 272.916L211.014 271.852C211.387 271.292 211.91 270.849 212.582 270.522C213.254 270.195 214.029 270.032 214.906 270.032C215.634 270.032 216.269 270.153 216.81 270.396C217.361 270.629 217.785 270.961 218.084 271.39C218.392 271.819 218.546 272.333 218.546 272.93C218.546 273.247 218.504 273.565 218.42 273.882C218.345 274.19 218.187 274.517 217.944 274.862C217.711 275.207 217.365 275.595 216.908 276.024L213.772 278.978L213.338 278.152H218.868V280H211.462Z"
          className={`${
            activeEnclosure === "2" ? "fill-white" : "fill-gray-400"
          } `}
        />
        <rect
          id="enclosure_3"
          x="51.5"
          y="314.5"
          width="336"
          height="44"
          rx="9.5"
          className={`${
            activeEnclosure === "3"
              ? "fill-red-500 stroke-red-700"
              : "fill-gray-100 stroke-gray-300"
          }`}
        />
        <path
          id="text_3"
          d="M215.724 341.168C215.043 341.168 214.366 341.079 213.694 340.902C213.022 340.715 212.453 340.454 211.986 340.118L212.868 338.382C213.241 338.653 213.675 338.867 214.17 339.026C214.665 339.185 215.164 339.264 215.668 339.264C216.237 339.264 216.685 339.152 217.012 338.928C217.339 338.704 217.502 338.396 217.502 338.004C217.502 337.631 217.357 337.337 217.068 337.122C216.779 336.907 216.312 336.8 215.668 336.8H214.632V335.302L217.362 332.208L217.614 333.02H212.476V331.2H219.336V332.67L216.62 335.764L215.472 335.106H216.13C217.334 335.106 218.244 335.377 218.86 335.918C219.476 336.459 219.784 337.155 219.784 338.004C219.784 338.555 219.639 339.073 219.35 339.558C219.061 340.034 218.617 340.421 218.02 340.72C217.423 341.019 216.657 341.168 215.724 341.168Z"
          className={`${
            activeEnclosure === "3" ? "fill-white" : "fill-gray-400"
          } `}
        />
        <rect
          id="enclosure_4"
          x="51.5"
          y="374.5"
          width="336"
          height="44"
          rx="9.5"
          className={`${
            activeEnclosure === "4"
              ? "fill-red-500 stroke-red-700"
              : "fill-gray-100 stroke-gray-300"
          }`}
        />
        <path
          id="text_4"
          d="M211.434 398.942V397.416L216.054 391.2H218.434L213.912 397.416L212.806 397.094H220.52V398.942H211.434ZM216.712 401V398.942L216.782 397.094V395.26H218.924V401H216.712Z"
          className={`${
            activeEnclosure === "4" ? "fill-white" : "fill-gray-400"
          } `}
        />
        <rect
          id="enclosure_5"
          x="51.5"
          y="434.5"
          width="336"
          height="44"
          rx="9.5"
          className={`${
            activeEnclosure === "5"
              ? "fill-red-500 stroke-red-700"
              : "fill-gray-100 stroke-gray-300"
          }`}
        />
        <path
          id="text_5"
          d="M215.878 461.168C215.197 461.168 214.52 461.079 213.848 460.902C213.185 460.715 212.616 460.454 212.14 460.118L213.036 458.382C213.409 458.653 213.839 458.867 214.324 459.026C214.819 459.185 215.318 459.264 215.822 459.264C216.391 459.264 216.839 459.152 217.166 458.928C217.493 458.704 217.656 458.391 217.656 457.99C217.656 457.738 217.591 457.514 217.46 457.318C217.329 457.122 217.096 456.973 216.76 456.87C216.433 456.767 215.971 456.716 215.374 456.716H212.868L213.372 451.2H219.35V453.02H214.184L215.36 451.984L215.01 455.918L213.834 454.882H215.906C216.877 454.882 217.656 455.017 218.244 455.288C218.841 455.549 219.275 455.909 219.546 456.366C219.817 456.823 219.952 457.341 219.952 457.92C219.952 458.499 219.807 459.035 219.518 459.53C219.229 460.015 218.781 460.412 218.174 460.72C217.577 461.019 216.811 461.168 215.878 461.168Z"
          className={`${
            activeEnclosure === "5" ? "fill-white" : "fill-gray-400"
          } `}
        />
        <rect
          id="enclosure_6"
          x="51.5"
          y="494.5"
          width="336"
          height="44"
          rx="9.5"
          className={`${
            activeEnclosure === "6"
              ? "fill-red-500 stroke-red-700"
              : "fill-gray-100 stroke-gray-300"
          }`}
        />
        <path
          id="text_6"
          d="M216.928 521.168C216.032 521.168 215.253 520.981 214.59 520.608C213.937 520.235 213.433 519.689 213.078 518.97C212.723 518.251 212.546 517.365 212.546 516.31C212.546 515.181 212.756 514.224 213.176 513.44C213.605 512.656 214.193 512.059 214.94 511.648C215.696 511.237 216.564 511.032 217.544 511.032C218.067 511.032 218.566 511.088 219.042 511.2C219.518 511.312 219.929 511.48 220.274 511.704L219.434 513.37C219.163 513.183 218.874 513.057 218.566 512.992C218.258 512.917 217.936 512.88 217.6 512.88C216.751 512.88 216.079 513.137 215.584 513.65C215.089 514.163 214.842 514.924 214.842 515.932C214.842 516.1 214.842 516.287 214.842 516.492C214.851 516.697 214.879 516.903 214.926 517.108L214.296 516.52C214.473 516.156 214.702 515.853 214.982 515.61C215.262 515.358 215.593 515.171 215.976 515.05C216.368 514.919 216.797 514.854 217.264 514.854C217.899 514.854 218.468 514.98 218.972 515.232C219.476 515.484 219.877 515.839 220.176 516.296C220.484 516.753 220.638 517.29 220.638 517.906C220.638 518.569 220.47 519.147 220.134 519.642C219.807 520.127 219.364 520.505 218.804 520.776C218.253 521.037 217.628 521.168 216.928 521.168ZM216.802 519.474C217.119 519.474 217.399 519.418 217.642 519.306C217.894 519.185 218.09 519.012 218.23 518.788C218.37 518.564 218.44 518.307 218.44 518.018C218.44 517.57 218.286 517.215 217.978 516.954C217.679 516.683 217.278 516.548 216.774 516.548C216.438 516.548 216.144 516.613 215.892 516.744C215.64 516.865 215.439 517.038 215.29 517.262C215.15 517.477 215.08 517.729 215.08 518.018C215.08 518.298 215.15 518.55 215.29 518.774C215.43 518.989 215.626 519.161 215.878 519.292C216.13 519.413 216.438 519.474 216.802 519.474Z"
          className={`${
            activeEnclosure === "6" ? "fill-white" : "fill-gray-400"
          } `}
        />
        <rect
          id="vip_block_3"
          x="316.5"
          y="160.633"
          width="40"
          height="19"
          rx="4.5"
          fill="#CA8A04"
          stroke="#D9D9D9"
        />
        <path
          id="vip_block_text_3"
          d="M331.47 174L328.45 167H330.2L332.84 173.2H331.81L334.49 167H336.1L333.07 174H331.47ZM336.684 174V167H338.304V174H336.684ZM339.966 174V167H342.996C343.622 167 344.162 167.103 344.616 167.31C345.069 167.51 345.419 167.8 345.666 168.18C345.912 168.56 346.036 169.013 346.036 169.54C346.036 170.06 345.912 170.51 345.666 170.89C345.419 171.27 345.069 171.563 344.616 171.77C344.162 171.97 343.622 172.07 342.996 172.07H340.866L341.586 171.34V174H339.966ZM341.586 171.52L340.866 170.75H342.906C343.406 170.75 343.779 170.643 344.026 170.43C344.272 170.217 344.396 169.92 344.396 169.54C344.396 169.153 344.272 168.853 344.026 168.64C343.779 168.427 343.406 168.32 342.906 168.32H340.866L341.586 167.55V171.52Z"
          fill="white"
        />
        <rect
          id="vip_block_2"
          x="148.5"
          y="160.633"
          width="133"
          height="19"
          rx="4.5"
          fill="#CA8A04"
          stroke="#D9D9D9"
        />
        <path
          id="vip_block_text_2"
          d="M208.97 174L205.95 167H207.7L210.34 173.2H209.31L211.99 167H213.6L210.57 174H208.97ZM214.184 174V167H215.804V174H214.184ZM217.466 174V167H220.496C221.122 167 221.662 167.103 222.116 167.31C222.569 167.51 222.919 167.8 223.166 168.18C223.412 168.56 223.536 169.013 223.536 169.54C223.536 170.06 223.412 170.51 223.166 170.89C222.919 171.27 222.569 171.563 222.116 171.77C221.662 171.97 221.122 172.07 220.496 172.07H218.366L219.086 171.34V174H217.466ZM219.086 171.52L218.366 170.75H220.406C220.906 170.75 221.279 170.643 221.526 170.43C221.772 170.217 221.896 169.92 221.896 169.54C221.896 169.153 221.772 168.853 221.526 168.64C221.279 168.427 220.906 168.32 220.406 168.32H218.366L219.086 167.55V171.52Z"
          fill="white"
        />
        <rect
          id="vip_block_1"
          x="73.5"
          y="160.633"
          width="40"
          height="19"
          rx="4.5"
          fill="#CA8A04"
          stroke="#D9D9D9"
        />
        <path
          id="vip_block_text_1"
          d="M86.47 174L83.45 167H85.2L87.84 173.2H86.81L89.49 167H91.1L88.07 174H86.47ZM91.6845 174V167H93.3045V174H91.6845ZM94.9657 174V167H97.9957C98.6224 167 99.1624 167.103 99.6157 167.31C100.069 167.51 100.419 167.8 100.666 168.18C100.912 168.56 101.036 169.013 101.036 169.54C101.036 170.06 100.912 170.51 100.666 170.89C100.419 171.27 100.069 171.563 99.6157 171.77C99.1624 171.97 98.6224 172.07 97.9957 172.07H95.8657L96.5857 171.34V174H94.9657ZM96.5857 171.52L95.8657 170.75H97.9057C98.4057 170.75 98.7791 170.643 99.0257 170.43C99.2724 170.217 99.3957 169.92 99.3957 169.54C99.3957 169.153 99.2724 168.853 99.0257 168.64C98.7791 168.427 98.4057 168.32 97.9057 168.32H95.8657L96.5857 167.55V171.52Z"
          fill="white"
        />
        <path
          id="Screen"
          d="M196.629 17.9321C195.957 17.9321 195.313 17.8441 194.697 17.6681C194.081 17.4841 193.585 17.2481 193.209 16.9601L193.869 15.4961C194.229 15.7521 194.653 15.9641 195.141 16.1321C195.637 16.2921 196.137 16.3721 196.641 16.3721C197.025 16.3721 197.333 16.3361 197.565 16.2641C197.805 16.1841 197.981 16.0761 198.093 15.9401C198.205 15.8041 198.261 15.6481 198.261 15.4721C198.261 15.2481 198.173 15.0721 197.997 14.9441C197.821 14.8081 197.589 14.7001 197.301 14.6201C197.013 14.5321 196.693 14.4521 196.341 14.3801C195.997 14.3001 195.649 14.2041 195.297 14.0921C194.953 13.9801 194.637 13.8361 194.349 13.6601C194.061 13.4841 193.825 13.2521 193.641 12.9641C193.465 12.6761 193.377 12.3081 193.377 11.8601C193.377 11.3801 193.505 10.9441 193.761 10.5521C194.025 10.1521 194.417 9.83609 194.937 9.60409C195.465 9.36409 196.125 9.24409 196.917 9.24409C197.445 9.24409 197.965 9.30809 198.477 9.43609C198.989 9.55609 199.441 9.74009 199.833 9.98809L199.233 11.4641C198.841 11.2401 198.449 11.0761 198.057 10.9721C197.665 10.8601 197.281 10.8041 196.905 10.8041C196.529 10.8041 196.221 10.8481 195.981 10.9361C195.741 11.0241 195.569 11.1401 195.465 11.2841C195.361 11.4201 195.309 11.5801 195.309 11.7641C195.309 11.9801 195.397 12.1561 195.573 12.2921C195.749 12.4201 195.981 12.5241 196.269 12.6041C196.557 12.6841 196.873 12.7641 197.217 12.8441C197.569 12.9241 197.917 13.0161 198.261 13.1201C198.613 13.2241 198.933 13.3641 199.221 13.5401C199.509 13.7161 199.741 13.9481 199.917 14.2361C200.101 14.5241 200.193 14.8881 200.193 15.3281C200.193 15.8001 200.061 16.2321 199.797 16.6241C199.533 17.0161 199.137 17.3321 198.609 17.5721C198.089 17.8121 197.429 17.9321 196.629 17.9321ZM204.509 17.8841C203.813 17.8841 203.193 17.7441 202.649 17.4641C202.105 17.1761 201.677 16.7801 201.365 16.2761C201.061 15.7721 200.909 15.2001 200.909 14.5601C200.909 13.9121 201.061 13.3401 201.365 12.8441C201.677 12.3401 202.105 11.9481 202.649 11.6681C203.193 11.3801 203.813 11.2361 204.509 11.2361C205.189 11.2361 205.781 11.3801 206.285 11.6681C206.789 11.9481 207.161 12.3521 207.401 12.8801L205.949 13.6601C205.781 13.3561 205.569 13.1321 205.313 12.9881C205.065 12.8441 204.793 12.7721 204.497 12.7721C204.177 12.7721 203.889 12.8441 203.633 12.9881C203.377 13.1321 203.173 13.3361 203.021 13.6001C202.877 13.8641 202.805 14.1841 202.805 14.5601C202.805 14.9361 202.877 15.2561 203.021 15.5201C203.173 15.7841 203.377 15.9881 203.633 16.1321C203.889 16.2761 204.177 16.3481 204.497 16.3481C204.793 16.3481 205.065 16.2801 205.313 16.1441C205.569 16.0001 205.781 15.7721 205.949 15.4601L207.401 16.2521C207.161 16.7721 206.789 17.1761 206.285 17.4641C205.781 17.7441 205.189 17.8841 204.509 17.8841ZM208.479 17.7881V11.3321H210.267V13.1561L210.015 12.6281C210.207 12.1721 210.515 11.8281 210.939 11.5961C211.363 11.3561 211.879 11.2361 212.487 11.2361V12.9641C212.407 12.9561 212.335 12.9521 212.271 12.9521C212.207 12.9441 212.139 12.9401 212.067 12.9401C211.555 12.9401 211.139 13.0881 210.819 13.3841C210.507 13.6721 210.351 14.1241 210.351 14.7401V17.7881H208.479ZM216.757 17.8841C216.021 17.8841 215.373 17.7401 214.813 17.4521C214.261 17.1641 213.833 16.7721 213.529 16.2761C213.225 15.7721 213.073 15.2001 213.073 14.5601C213.073 13.9121 213.221 13.3401 213.517 12.8441C213.821 12.3401 214.233 11.9481 214.753 11.6681C215.273 11.3801 215.861 11.2361 216.517 11.2361C217.149 11.2361 217.717 11.3721 218.221 11.6441C218.733 11.9081 219.137 12.2921 219.433 12.7961C219.729 13.2921 219.877 13.8881 219.877 14.5841C219.877 14.6561 219.873 14.7401 219.865 14.8361C219.857 14.9241 219.849 15.0081 219.841 15.0881H214.597V13.9961H218.857L218.137 14.3201C218.137 13.9841 218.069 13.6921 217.933 13.4441C217.797 13.1961 217.609 13.0041 217.369 12.8681C217.129 12.7241 216.849 12.6521 216.529 12.6521C216.209 12.6521 215.925 12.7241 215.677 12.8681C215.437 13.0041 215.249 13.2001 215.113 13.4561C214.977 13.7041 214.909 14.0001 214.909 14.3441V14.6321C214.909 14.9841 214.985 15.2961 215.137 15.5681C215.297 15.8321 215.517 16.0361 215.797 16.1801C216.085 16.3161 216.421 16.3841 216.805 16.3841C217.149 16.3841 217.449 16.3321 217.705 16.2281C217.969 16.1241 218.209 15.9681 218.425 15.7601L219.421 16.8401C219.125 17.1761 218.753 17.4361 218.305 17.6201C217.857 17.7961 217.341 17.8841 216.757 17.8841ZM224.328 17.8841C223.592 17.8841 222.944 17.7401 222.384 17.4521C221.832 17.1641 221.404 16.7721 221.1 16.2761C220.796 15.7721 220.644 15.2001 220.644 14.5601C220.644 13.9121 220.792 13.3401 221.088 12.8441C221.392 12.3401 221.804 11.9481 222.324 11.6681C222.844 11.3801 223.432 11.2361 224.088 11.2361C224.72 11.2361 225.288 11.3721 225.792 11.6441C226.304 11.9081 226.708 12.2921 227.004 12.7961C227.3 13.2921 227.448 13.8881 227.448 14.5841C227.448 14.6561 227.444 14.7401 227.436 14.8361C227.428 14.9241 227.42 15.0081 227.412 15.0881H222.168V13.9961H226.428L225.708 14.3201C225.708 13.9841 225.64 13.6921 225.504 13.4441C225.368 13.1961 225.18 13.0041 224.94 12.8681C224.7 12.7241 224.42 12.6521 224.1 12.6521C223.78 12.6521 223.496 12.7241 223.248 12.8681C223.008 13.0041 222.82 13.2001 222.684 13.4561C222.548 13.7041 222.48 14.0001 222.48 14.3441V14.6321C222.48 14.9841 222.556 15.2961 222.708 15.5681C222.868 15.8321 223.088 16.0361 223.368 16.1801C223.656 16.3161 223.992 16.3841 224.376 16.3841C224.72 16.3841 225.02 16.3321 225.276 16.2281C225.54 16.1241 225.78 15.9681 225.996 15.7601L226.992 16.8401C226.696 17.1761 226.324 17.4361 225.876 17.6201C225.428 17.7961 224.912 17.8841 224.328 17.8841ZM232.618 11.2361C233.13 11.2361 233.586 11.3401 233.986 11.5481C234.394 11.7481 234.714 12.0601 234.946 12.4841C235.178 12.9001 235.294 13.4361 235.294 14.0921V17.7881H233.422V14.3801C233.422 13.8601 233.306 13.4761 233.074 13.2281C232.85 12.9801 232.53 12.8561 232.114 12.8561C231.818 12.8561 231.55 12.9201 231.31 13.0481C231.078 13.1681 230.894 13.3561 230.758 13.6121C230.63 13.8681 230.566 14.1961 230.566 14.5961V17.7881H228.694V11.3321H230.482V13.1201L230.146 12.5801C230.378 12.1481 230.71 11.8161 231.142 11.5841C231.574 11.3521 232.066 11.2361 232.618 11.2361Z"
          fill="black"
        />
        <path
          id="Entrance"
          d="M60.8075 593.304H64.1775V594.564H60.8075V593.304ZM60.9275 596.184H64.7375V597.484H59.3175V590.484H64.6075V591.784H60.9275V596.184ZM69.1865 592.024C69.6132 592.024 69.9932 592.111 70.3265 592.284C70.6665 592.451 70.9332 592.711 71.1265 593.064C71.3198 593.411 71.4165 593.858 71.4165 594.404V597.484H69.8565V594.644C69.8565 594.211 69.7598 593.891 69.5665 593.684C69.3798 593.478 69.1132 593.374 68.7665 593.374C68.5198 593.374 68.2965 593.428 68.0965 593.534C67.9032 593.634 67.7498 593.791 67.6365 594.004C67.5298 594.218 67.4765 594.491 67.4765 594.824V597.484H65.9165V592.104H67.4065V593.594L67.1265 593.144C67.3198 592.784 67.5965 592.508 67.9565 592.314C68.3165 592.121 68.7265 592.024 69.1865 592.024ZM75.0306 597.564C74.3972 597.564 73.9039 597.404 73.5506 597.084C73.1972 596.758 73.0206 596.274 73.0206 595.634V590.914H74.5806V595.614C74.5806 595.841 74.6406 596.018 74.7606 596.144C74.8806 596.264 75.0439 596.324 75.2506 596.324C75.4972 596.324 75.7072 596.258 75.8806 596.124L76.3006 597.224C76.1406 597.338 75.9472 597.424 75.7206 597.484C75.5006 597.538 75.2706 597.564 75.0306 597.564ZM72.1906 593.424V592.224H75.9206V593.424H72.1906ZM77.1763 597.484V592.104H78.6663V593.624L78.4563 593.184C78.6163 592.804 78.8729 592.518 79.2263 592.324C79.5796 592.124 80.0096 592.024 80.5163 592.024V593.464C80.4496 593.458 80.3896 593.454 80.3363 593.454C80.2829 593.448 80.2263 593.444 80.1663 593.444C79.7396 593.444 79.3929 593.568 79.1263 593.814C78.8663 594.054 78.7363 594.431 78.7363 594.944V597.484H77.1763ZM84.3923 597.484V596.434L84.2923 596.204V594.324C84.2923 593.991 84.189 593.731 83.9823 593.544C83.7823 593.358 83.4723 593.264 83.0523 593.264C82.7656 593.264 82.4823 593.311 82.2023 593.404C81.929 593.491 81.6956 593.611 81.5023 593.764L80.9423 592.674C81.2356 592.468 81.589 592.308 82.0023 592.194C82.4156 592.081 82.8356 592.024 83.2623 592.024C84.0823 592.024 84.719 592.218 85.1723 592.604C85.6256 592.991 85.8523 593.594 85.8523 594.414V597.484H84.3923ZM82.7523 597.564C82.3323 597.564 81.9723 597.494 81.6723 597.354C81.3723 597.208 81.1423 597.011 80.9823 596.764C80.8223 596.518 80.7423 596.241 80.7423 595.934C80.7423 595.614 80.819 595.334 80.9723 595.094C81.1323 594.854 81.3823 594.668 81.7223 594.534C82.0623 594.394 82.5056 594.324 83.0523 594.324H84.4823V595.234H83.2223C82.8556 595.234 82.6023 595.294 82.4623 595.414C82.329 595.534 82.2623 595.684 82.2623 595.864C82.2623 596.064 82.339 596.224 82.4923 596.344C82.6523 596.458 82.869 596.514 83.1423 596.514C83.4023 596.514 83.6356 596.454 83.8423 596.334C84.049 596.208 84.199 596.024 84.2923 595.784L84.5323 596.504C84.419 596.851 84.2123 597.114 83.9123 597.294C83.6123 597.474 83.2256 597.564 82.7523 597.564ZM90.5342 592.024C90.9608 592.024 91.3408 592.111 91.6742 592.284C92.0142 592.451 92.2808 592.711 92.4742 593.064C92.6675 593.411 92.7642 593.858 92.7642 594.404V597.484H91.2042V594.644C91.2042 594.211 91.1075 593.891 90.9142 593.684C90.7275 593.478 90.4608 593.374 90.1142 593.374C89.8675 593.374 89.6442 593.428 89.4442 593.534C89.2508 593.634 89.0975 593.791 88.9842 594.004C88.8775 594.218 88.8242 594.491 88.8242 594.824V597.484H87.2642V592.104H88.7542V593.594L88.4742 593.144C88.6675 592.784 88.9442 592.508 89.3042 592.314C89.6642 592.121 90.0742 592.024 90.5342 592.024ZM96.8173 597.564C96.2373 597.564 95.7206 597.448 95.2673 597.214C94.814 596.974 94.4573 596.644 94.1973 596.224C93.944 595.804 93.8173 595.328 93.8173 594.794C93.8173 594.254 93.944 593.778 94.1973 593.364C94.4573 592.944 94.814 592.618 95.2673 592.384C95.7206 592.144 96.2373 592.024 96.8173 592.024C97.384 592.024 97.8773 592.144 98.2973 592.384C98.7173 592.618 99.0273 592.954 99.2273 593.394L98.0173 594.044C97.8773 593.791 97.7006 593.604 97.4873 593.484C97.2806 593.364 97.054 593.304 96.8073 593.304C96.5406 593.304 96.3006 593.364 96.0873 593.484C95.874 593.604 95.704 593.774 95.5773 593.994C95.4573 594.214 95.3973 594.481 95.3973 594.794C95.3973 595.108 95.4573 595.374 95.5773 595.594C95.704 595.814 95.874 595.984 96.0873 596.104C96.3006 596.224 96.5406 596.284 96.8073 596.284C97.054 596.284 97.2806 596.228 97.4873 596.114C97.7006 595.994 97.8773 595.804 98.0173 595.544L99.2273 596.204C99.0273 596.638 98.7173 596.974 98.2973 597.214C97.8773 597.448 97.384 597.564 96.8173 597.564ZM102.727 597.564C102.114 597.564 101.574 597.444 101.107 597.204C100.647 596.964 100.29 596.638 100.037 596.224C99.7838 595.804 99.6571 595.328 99.6571 594.794C99.6571 594.254 99.7805 593.778 100.027 593.364C100.28 592.944 100.624 592.618 101.057 592.384C101.49 592.144 101.98 592.024 102.527 592.024C103.054 592.024 103.527 592.138 103.947 592.364C104.374 592.584 104.71 592.904 104.957 593.324C105.204 593.738 105.327 594.234 105.327 594.814C105.327 594.874 105.324 594.944 105.317 595.024C105.31 595.098 105.304 595.168 105.297 595.234H100.927V594.324H104.477L103.877 594.594C103.877 594.314 103.82 594.071 103.707 593.864C103.594 593.658 103.437 593.498 103.237 593.384C103.037 593.264 102.804 593.204 102.537 593.204C102.27 593.204 102.034 593.264 101.827 593.384C101.627 593.498 101.47 593.661 101.357 593.874C101.244 594.081 101.187 594.328 101.187 594.614V594.854C101.187 595.148 101.25 595.408 101.377 595.634C101.51 595.854 101.694 596.024 101.927 596.144C102.167 596.258 102.447 596.314 102.767 596.314C103.054 596.314 103.304 596.271 103.517 596.184C103.737 596.098 103.937 595.968 104.117 595.794L104.947 596.694C104.7 596.974 104.39 597.191 104.017 597.344C103.644 597.491 103.214 597.564 102.727 597.564Z"
          fill="black"
        />
        <g id="walkway">
          <line
            id="Line 100"
            x1="299.607"
            y1="115.397"
            x2="404.081"
            y2="115.397"
            stroke="#2626FF"
            strokeDasharray="6 6"
          />
          <line
            id="Line 103"
            x1="21.1543"
            y1="115.397"
            x2="299.608"
            y2="115.397"
            stroke="#2626FF"
            strokeDasharray="6 6"
          />
          <line
            id="Line 106"
            x1="20.5"
            y1="567"
            x2="20.5"
            y2="116"
            stroke="#2626FF"
            strokeDasharray="6 6"
          />
          <line
            id="Line 101"
            x1="403.58"
            y1="115.897"
            x2="403.58"
            y2="66.9903"
            stroke="#2626FF"
            strokeDasharray="6 6"
          />
          <line
            id="Line 104"
            x1="30.9453"
            y1="115.897"
            x2="30.9453"
            y2="66.9903"
            stroke="#2626FF"
            strokeDasharray="6 6"
          />
          <line
            id="Line 107"
            x1="21"
            y1="566.5"
            x2="82"
            y2="566.5"
            stroke="#2626FF"
            strokeDasharray="6 6"
          />
          <line
            id="Line 108"
            x1="81.5"
            y1="583"
            x2="81.5"
            y2="567"
            stroke="#2626FF"
            strokeDasharray="6 6"
          />
          <line
            id="Line 102"
            x1="389.404"
            y1="66.4902"
            x2="404.082"
            y2="66.4902"
            stroke="#2626FF"
            strokeDasharray="6 6"
          />
          <line
            id="Line 105"
            x1="30.9997"
            y1="66.5"
            x2="50.511"
            y2="66.4902"
            stroke="#2626FF"
            strokeDasharray="6 6"
          />
          <g id="Frame 18">
            <line
              id="Line 105_2"
              y1="-0.5"
              x2="34"
              y2="-0.5"
              transform="matrix(0.999999 -0.0017148 0.00189214 0.999998 117.627 81.0721)"
              stroke="#2626FF"
              strokeDasharray="6 6"
            />
          </g>
        </g>
        <rect
          id="seat_boundry"
          x="39.5"
          y="140.5"
          width="361"
          height="415"
          rx="9.5"
          stroke="black"
        />
      </g>
    </svg>
  );
}