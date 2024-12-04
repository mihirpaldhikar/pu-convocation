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

interface ConvocationProps {
  fillColor?: string;
}

export default function Convocation({
  fillColor = "black",
}: Readonly<ConvocationProps>): JSX.Element {
  return (
    <svg
      viewBox="0 0 648 87"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={"w-full lg:w-[50vw]"}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M502.534 17.7937C503.243 15.5695 503.669 13.4761 502.817 11.7752C500.547 10.5977 499.127 11.121 497.141 10.5977C496.573 12.1677 496.147 13.6069 496.431 14.7845C494.87 15.7003 490.896 13.9994 489.477 12.691C491.322 7.98094 500.263 6.28007 505.514 10.0743C509.204 12.5602 507.784 18.1862 502.534 17.7937ZM493.876 86.3518C500.83 88.0527 506.365 86.6135 509.771 79.5483C505.798 71.5673 506.791 61.7546 505.656 52.8577C505.23 53.1194 504.804 53.512 504.378 53.6428C504.804 53.1195 505.23 52.3344 505.23 51.6803C505.23 50.5027 504.52 49.456 503.385 48.9327C504.378 48.5401 505.372 48.0168 505.94 46.8393C507.075 44.8768 506.365 41.0825 506.649 38.0733C507.217 31.924 508.068 25.9056 509.204 20.2796C509.771 17.4012 511.191 13.7378 510.197 11.2519C506.933 3.40171 492.883 4.71004 488.767 8.76596C484.368 13.2144 486.781 18.0553 487.49 22.1113C488.767 30.2231 489.903 39.7741 489.477 47.6243C485.361 47.6243 481.53 48.2785 477.698 48.8019C478.975 49.3252 480.678 49.8485 480.678 50.8952C479.685 51.4185 478.833 51.9419 477.982 52.5961C481.104 52.8577 485.219 51.2878 487.348 51.6803C484.936 53.6428 481.104 55.7362 479.827 57.9604C480.678 58.0912 482.807 57.437 482.949 58.0912C483.658 58.7454 481.53 60.4462 482.381 61.1004C484.794 59.1379 487.064 56.5211 489.761 55.2128C489.193 63.1938 489.193 71.044 487.632 79.2867C489.477 80.7258 490.187 82.5575 493.025 83.6042C494.302 73.2682 494.728 63.3246 495.154 53.2502C493.735 52.7269 492.457 52.0728 491.606 51.4186C492.173 49.7177 491.322 48.5401 491.606 46.9701C492.315 47.4935 494.16 49.0635 495.296 48.5402C495.154 37.9424 494.444 27.6064 493.876 17.1395C496.857 17.2703 501.682 20.4104 501.966 16.0928C498.418 16.4853 490.896 17.0087 488.484 12.8219C490.612 3.00922 513.035 7.32677 508.21 16.2236C506.081 20.1487 500.121 19.6254 495.012 18.4479C495.296 28.5222 496.431 38.4658 496.005 48.8019C497.141 48.9327 498.418 49.0635 499.553 49.1943C498.844 49.7177 498.276 50.6336 498.276 51.6803C498.276 52.8578 498.986 53.9044 500.121 54.4278C498.844 54.4278 497.566 54.1661 496.147 53.7736C496.005 64.3713 495.296 75.2308 493.876 86.3518ZM502.392 13.6069C502.392 11.6444 499.695 11.6444 497.992 11.7752C497.141 13.0836 497.992 13.8686 497.283 15.177C499.269 15.3078 501.256 15.4386 502.392 13.6069ZM27.2484 71.5673C18.7332 71.5673 12.0631 68.9506 7.23783 63.848C2.4126 58.7454 0 51.8111 0 43.1759C0 39.3817 0.709584 35.849 1.98685 32.5781C3.26412 29.3072 5.10906 26.298 7.66359 23.6813C10.0762 21.0646 12.9146 18.9712 16.4625 17.4012C20.0105 15.8312 23.8423 15.0462 28.0998 15.0462C33.9185 15.0462 38.6018 16.3545 42.1498 18.8404C45.8397 21.3262 47.5427 24.728 47.5427 29.1764C47.5427 31.0081 47.117 32.5782 46.1235 34.0174C45.1301 35.4566 43.569 36.1107 41.4402 36.1107C39.0276 36.1107 37.3246 35.5874 36.0473 34.5407C34.77 33.494 34.0604 32.1857 34.0604 30.8773C34.0604 29.3073 34.3443 27.6064 34.77 25.9055C35.1958 24.2047 35.4796 22.8963 35.6215 22.1113C34.9119 20.9337 33.9185 20.2795 32.4993 19.887C31.0801 19.4945 29.519 19.3637 27.9579 19.3637C26.113 19.3637 24.2681 19.7562 22.565 20.5412C20.862 21.3262 19.159 22.6346 17.456 24.5972C16.0368 26.4289 14.7595 28.9147 13.908 31.924C13.0565 35.064 12.4888 38.7275 12.4888 42.9142C12.4888 49.7177 14.1918 55.2128 17.456 59.3995C20.7201 63.7171 24.9777 65.8105 30.3706 65.8105C34.2024 65.8105 37.4665 64.8947 40.021 63.1938C42.5756 61.493 44.9882 58.8762 47.2589 55.4745L51.0907 57.6987C48.5361 62.0163 44.9882 65.418 40.7306 67.9039C36.1892 70.2589 31.7897 71.5673 27.2484 71.5673ZM112.683 42.7833C112.683 46.5776 111.974 50.241 110.696 53.9044C109.419 57.5678 107.574 60.5771 105.162 63.1938C102.465 66.0722 99.201 68.2964 95.6531 69.6047C92.1051 71.0439 87.9895 71.6982 83.4481 71.6982C79.7582 71.6982 76.2102 71.044 72.8042 69.7356C69.3981 68.4273 66.4179 66.5956 63.8633 64.1097C61.3088 61.7546 59.18 58.7453 57.7608 55.2128C56.1997 51.6802 55.4901 47.7551 55.4901 43.4375C55.4901 35.064 58.1866 28.2606 63.4376 22.8963C68.8305 17.532 75.7845 14.9153 84.4415 14.9153C92.6728 14.9153 99.4849 17.4011 104.736 22.5037C109.987 27.6064 112.683 34.4098 112.683 42.7833ZM100.336 42.9142C100.336 40.1667 100.053 37.2882 99.4849 34.279C98.9172 31.2698 97.9238 28.6531 96.7884 26.5597C95.5112 24.3355 93.8082 22.5037 91.8213 21.1954C89.6925 19.887 87.2799 19.102 84.2996 19.102C81.1774 19.102 78.6229 19.7562 76.4941 21.1954C74.3653 22.6346 72.5204 24.4664 71.2431 26.8214C69.9658 29.0456 69.1143 31.5315 68.5466 34.4099C67.979 37.2883 67.837 40.0358 67.837 42.6525C67.837 46.1851 68.1209 49.3252 68.8305 52.3344C69.3982 55.3437 70.3916 57.9604 71.8108 60.3154C73.2299 62.6705 74.933 64.5022 76.9198 65.8105C78.9067 67.1189 81.4612 67.7731 84.5834 67.7731C89.5506 67.7731 93.5243 65.5489 96.3627 61.2313C98.9172 56.652 100.336 50.6336 100.336 42.9142ZM185.913 70.1281H157.104V66.5955C157.955 66.4647 159.091 66.4647 160.084 66.3338C161.219 66.203 162.071 66.0722 162.781 65.9414C163.916 65.5488 164.767 65.0255 165.193 64.2405C165.761 63.4555 166.045 62.4088 166.045 61.1004V33.494C166.045 29.6998 165.051 26.6905 163.064 24.728C161.078 22.6346 158.665 21.588 155.968 21.588C153.84 21.588 151.995 21.8496 150.292 22.5037C148.589 23.1579 147.028 23.8121 145.608 24.728C144.331 25.513 143.338 26.4289 142.486 27.4756C141.777 28.3914 141.209 29.1764 140.783 29.8306V60.7079C140.783 61.8854 141.067 62.9321 141.635 63.7171C142.202 64.5021 143.054 65.1563 144.189 65.5489C145.041 65.9414 145.892 66.203 146.886 66.3338C147.879 66.4647 148.873 66.5956 149.866 66.7264V70.2589H121.056V66.7264C121.908 66.5956 122.901 66.5956 123.895 66.4647C124.888 66.3339 125.74 66.2031 126.449 66.0722C127.585 65.6797 128.436 65.1563 128.862 64.3713C129.43 63.5863 129.714 62.5396 129.714 61.2313V28.1298C129.714 26.9522 129.43 25.7747 128.862 24.728C128.294 23.6813 127.443 22.8963 126.449 22.2421C125.74 21.8496 124.746 21.4571 123.753 21.3263C122.76 21.0646 121.624 20.9338 120.489 20.9338V17.4012L140.074 16.2236L140.925 17.0087V24.5972H141.209C142.202 23.6813 143.338 22.6346 144.757 21.4571C146.176 20.2796 147.453 19.2329 148.731 18.4479C150.15 17.532 151.995 16.8778 153.982 16.2236C155.968 15.7003 158.239 15.3078 160.794 15.3078C166.328 15.3078 170.586 16.8778 173.283 20.1487C175.979 23.4196 177.398 27.6064 177.398 32.9706V60.8388C177.398 62.1472 177.682 63.063 178.108 63.848C178.533 64.633 179.385 65.2872 180.52 65.6797C181.514 66.0722 182.365 66.3339 183.075 66.4647C183.784 66.5956 184.778 66.7264 186.055 66.8572V70.1281H185.913ZM250.912 19.7562C249.067 20.0179 247.506 20.6721 245.803 21.588C244.242 22.5038 242.823 24.0738 241.687 26.298C239.417 31.139 236.862 36.2415 234.449 41.475C231.895 46.7084 229.34 52.3344 226.644 58.0912C225.792 59.7921 224.941 61.7546 224.089 63.9788C223.238 66.203 222.386 68.4272 221.677 70.5206H216.993C213.304 62.0163 209.756 54.297 206.633 47.2318C203.511 40.1667 200.247 32.9707 196.841 25.6438C195.989 23.943 194.712 22.6346 193.009 21.7188C191.306 20.8029 189.461 20.1487 187.758 20.0179V16.4853H214.865V20.2796C213.729 20.2796 212.168 20.5413 210.465 20.9338C208.62 21.3263 207.769 21.9804 207.769 22.6346C207.769 22.7655 207.911 23.0271 208.053 23.4196C208.194 23.943 208.478 24.3355 208.62 24.9897C210.181 28.6531 212.594 33.7557 215.574 40.4283C218.555 46.9701 220.967 52.3344 222.812 56.3903C224.231 53.2503 226.076 49.456 228.205 44.8768C230.334 40.2975 232.604 35.1949 235.159 29.4381C235.585 28.5223 235.869 27.6064 236.294 26.6905C236.578 25.7747 236.862 24.9897 236.862 24.0738C236.862 23.4196 236.578 22.8963 235.869 22.3729C235.159 21.8496 234.449 21.4571 233.456 21.0646C232.604 20.6721 231.611 20.4104 230.76 20.2796C229.908 20.1488 229.198 20.0179 228.631 19.887V16.4853H251.054V19.7562H250.912ZM310.518 42.7833C310.518 46.5776 309.808 50.241 308.531 53.9044C307.254 57.5678 305.409 60.5771 302.996 63.1938C300.3 66.0722 297.035 68.2964 293.488 69.6047C289.94 71.0439 285.824 71.6982 281.282 71.6982C277.593 71.6982 274.045 71.044 270.639 69.7356C267.233 68.4273 264.252 66.5956 261.698 64.1097C259.143 61.7546 257.014 58.7453 255.595 55.2128C254.034 51.6802 253.325 47.7551 253.325 43.4375C253.325 35.064 256.021 28.2606 261.272 22.8963C266.665 17.532 273.619 14.9153 282.276 14.9153C290.507 14.9153 297.319 17.4011 302.57 22.5037C307.821 27.6064 310.518 34.4098 310.518 42.7833ZM298.313 42.9142C298.313 40.1667 298.029 37.2882 297.461 34.279C296.894 31.2698 295.9 28.6531 294.765 26.5597C293.487 24.3355 291.784 22.5037 289.798 21.1954C287.669 19.887 285.256 19.102 282.276 19.102C279.154 19.102 276.599 19.7562 274.47 21.1954C272.342 22.6346 270.497 24.4664 269.219 26.8214C267.942 29.0456 267.091 31.5315 266.523 34.4099C265.955 37.2883 265.813 40.0358 265.813 42.6525C265.813 46.1851 266.097 49.3252 266.807 52.3344C267.375 55.3437 268.368 57.9604 269.787 60.3154C271.206 62.6705 272.909 64.5022 274.896 65.8105C276.883 67.1189 279.438 67.7731 282.56 67.7731C287.527 67.7731 291.501 65.5489 294.339 61.2313C296.752 56.652 298.313 50.6336 298.313 42.9142ZM345.997 71.5673C337.482 71.5673 330.812 68.9506 325.987 63.848C321.162 58.7454 318.749 51.8111 318.749 43.1759C318.749 39.3817 319.459 35.849 320.736 32.5781C322.013 29.3072 323.858 26.298 326.413 23.6813C328.825 21.0646 331.664 18.9712 335.212 17.4012C338.759 15.8312 342.591 15.0462 346.849 15.0462C352.668 15.0462 357.351 16.3545 360.899 18.8404C364.589 21.3262 366.292 24.728 366.292 29.1764C366.292 31.0081 365.866 32.5782 364.873 34.0174C363.879 35.4566 362.318 36.1107 360.189 36.1107C357.777 36.1107 356.074 35.5874 354.796 34.5407C353.519 33.494 352.809 32.1857 352.809 30.8773C352.809 29.3073 353.093 27.6064 353.519 25.9055C353.945 24.2047 354.229 22.8963 354.371 22.1113C353.661 20.9337 352.668 20.2795 351.248 19.887C349.829 19.4945 348.268 19.3637 346.707 19.3637C344.862 19.3637 343.017 19.7562 341.314 20.5412C339.611 21.3262 337.908 22.6346 336.205 24.5972C334.786 26.4289 333.509 28.9147 332.657 31.924C331.806 35.064 331.238 38.7275 331.238 42.9142C331.238 49.7177 332.941 55.2128 336.205 59.3995C339.469 63.7171 343.727 65.8105 349.12 65.8105C352.951 65.8105 356.215 64.8947 358.77 63.1938C361.325 61.493 363.737 58.8762 366.008 55.4745L369.84 57.6987C367.285 62.0163 363.737 65.418 359.48 67.9039C355.08 70.2589 350.539 71.5673 345.997 71.5673ZM429.871 69.0815C428.026 69.7356 426.323 70.259 424.904 70.6515C423.485 71.044 421.924 71.1748 420.079 71.1748C416.957 71.1748 414.402 70.5206 412.557 69.2123C410.712 67.9039 409.435 65.9414 409.009 63.4555H408.583C406.029 66.0722 403.332 68.0347 400.352 69.4739C397.372 70.7823 393.824 71.5673 389.708 71.5673C385.309 71.5673 381.761 70.3898 378.922 67.9039C376.084 65.418 374.665 62.278 374.665 58.2221C374.665 56.1287 374.949 54.297 375.658 52.7269C376.226 51.0261 377.219 49.5868 378.497 48.2785C379.49 47.2318 380.767 46.1851 382.47 45.4001C384.032 44.4842 385.593 43.8301 387.012 43.3067C388.857 42.6525 392.405 41.6059 397.798 39.905C403.191 38.2041 406.88 36.8958 408.867 35.9799V30.6156C408.867 30.0923 408.725 29.1764 408.583 27.8681C408.3 26.5597 407.874 25.2513 407.164 24.0738C406.313 22.7654 405.177 21.5879 403.758 20.5412C402.339 19.4945 400.21 19.102 397.514 19.102C395.669 19.102 393.966 19.3637 392.405 19.887C390.844 20.4104 389.708 21.0646 389.141 21.7188C389.141 22.5038 389.283 23.5505 389.708 24.8589C390.134 26.2981 390.276 27.6064 390.276 28.7839C390.276 30.0923 389.708 31.1389 388.431 32.3165C387.154 33.3631 385.451 33.8865 383.322 33.8865C381.335 33.8865 379.916 33.2323 378.922 31.924C377.929 30.6156 377.503 29.1764 377.503 27.6064C377.503 25.9055 378.213 24.3355 379.49 22.7654C380.767 21.1954 382.47 19.8871 384.599 18.7095C386.444 17.6629 388.573 16.8778 391.127 16.0928C393.682 15.4386 396.095 15.0462 398.507 15.0462C401.771 15.0462 404.752 15.3078 407.164 15.7003C409.719 16.0928 411.848 17.0087 413.976 18.3171C415.963 19.6254 417.524 21.4571 418.518 23.8121C419.511 26.1672 420.079 29.0456 420.079 32.709C420.079 37.9425 420.079 42.5217 419.937 46.4468C419.795 50.5027 419.795 54.8203 419.795 59.5304C419.795 60.9696 420.079 62.0163 420.647 62.9321C421.214 63.7172 422.066 64.5021 423.059 65.0255C423.627 65.2872 424.62 65.5489 425.897 65.5489C427.175 65.5489 428.452 65.5489 429.871 65.5489V69.0815ZM409.009 40.4283C405.603 41.3442 402.623 42.26 400.068 43.045C397.514 43.9609 395.101 45.0076 392.972 46.3159C390.986 47.6243 389.424 49.0635 388.289 50.7644C387.154 52.4653 386.586 54.4278 386.586 56.7828C386.586 59.7921 387.438 62.0163 389.141 63.4555C390.844 64.8947 393.114 65.5489 395.669 65.5489C398.507 65.5489 400.92 64.8946 403.049 63.7171C405.177 62.4088 407.022 60.9696 408.442 59.2687L409.009 40.4283ZM471.595 67.7731C469.041 68.6889 466.628 69.6047 464.357 70.2589C462.087 70.9131 459.248 71.3057 455.984 71.3057C451.017 71.3057 447.611 70.1281 445.624 67.9039C443.637 65.6797 442.644 62.4088 442.644 58.3529V21.9804H432V16.747H442.786V0H453.572V16.747H470.318V21.9804H453.714V52.0728C453.714 54.297 453.855 56.2595 453.997 57.6987C454.139 59.2687 454.565 60.5771 455.275 61.6238C455.842 62.6705 456.836 63.4555 458.113 63.9788C459.39 64.5022 461.093 64.7639 463.222 64.7639C464.216 64.7639 465.635 64.633 467.622 64.5022C469.466 64.3713 470.886 64.1097 471.737 63.848V67.7731H471.595ZM574.486 42.7833C574.486 46.5776 573.777 50.241 572.499 53.9044C571.222 57.5678 569.377 60.5771 566.964 63.1938C564.268 66.0722 561.004 68.2964 557.456 69.6047C553.908 71.0439 549.792 71.6982 545.251 71.6982C541.561 71.6982 538.013 71.044 534.607 69.7356C531.201 68.4273 528.221 66.5956 525.666 64.1097C523.112 61.6238 520.983 58.7453 519.564 55.2128C518.003 51.6802 517.293 47.7551 517.293 43.4375C517.293 35.064 519.99 28.2606 525.24 22.8963C530.633 17.532 537.587 14.9153 546.244 14.9153C554.476 14.9153 561.288 17.4011 566.539 22.5037C571.79 27.6064 574.486 34.4098 574.486 42.7833ZM562.281 42.9142C562.281 40.1667 561.997 37.2882 561.43 34.279C560.862 31.2698 559.869 28.6531 558.733 26.5597C557.456 24.3355 555.753 22.5037 553.766 21.1954C551.637 19.887 549.225 19.102 546.244 19.102C543.122 19.102 540.568 19.7562 538.439 21.1954C536.31 22.6346 534.465 24.4664 533.188 26.8214C531.911 29.0456 531.059 31.5315 530.491 34.4099C529.924 37.2883 529.782 40.0358 529.782 42.6525C529.782 46.1851 530.066 49.3252 530.775 52.3344C531.343 55.3437 532.336 57.9604 533.756 60.3154C535.175 62.6705 536.878 64.5022 538.865 65.8105C540.852 67.1189 543.406 67.7731 546.528 67.7731C551.495 67.7731 555.469 65.5489 558.307 61.2313C560.72 56.652 562.281 50.6336 562.281 42.9142ZM647.858 70.1281H619.049V66.5955C619.9 66.4647 621.035 66.4647 622.029 66.3338C623.164 66.203 624.016 66.0722 624.725 65.9414C625.861 65.5488 626.712 65.0255 627.138 64.2405C627.706 63.4555 627.989 62.4088 627.989 61.1004V33.494C627.989 29.6998 626.996 26.6905 625.009 24.728C623.022 22.6346 620.61 21.588 617.913 21.588C615.784 21.588 613.94 21.8496 612.237 22.5037C610.534 23.1579 608.972 23.8121 607.553 24.728C606.276 25.513 605.282 26.4289 604.431 27.4756C603.721 28.3914 603.154 29.1764 602.728 29.8306V60.7079C602.728 61.8854 603.012 62.9321 603.579 63.7171C604.147 64.5021 604.999 65.1563 606.134 65.5489C606.986 65.9414 607.837 66.203 608.83 66.3338C609.824 66.4647 610.817 66.5956 611.811 66.7264V70.2589H583.001V66.7264C583.853 66.5956 584.846 66.5956 585.84 66.4647C586.833 66.3339 587.685 66.2031 588.394 66.0722C589.53 65.6797 590.381 65.1563 590.807 64.3713C591.375 63.5863 591.658 62.5396 591.658 61.2313V28.1298C591.658 26.9522 591.375 25.7747 590.807 24.728C590.239 23.6813 589.388 22.8963 588.394 22.2421C587.685 21.8496 586.691 21.4571 585.698 21.3263C584.704 21.0646 583.569 20.9338 582.434 20.9338V17.4012L602.018 16.2236L602.87 17.0087V24.5972H603.154C604.147 23.6813 605.282 22.6346 606.702 21.4571C608.121 20.2796 609.398 19.2329 610.675 18.4479C612.095 17.532 613.939 16.8778 615.926 16.2236C617.913 15.7003 620.184 15.3078 622.738 15.3078C628.273 15.3078 632.531 16.8778 635.227 20.1487C637.924 23.4196 639.343 27.6064 639.343 32.9706V60.8388C639.343 62.1472 639.627 63.063 640.052 63.848C640.478 64.633 641.33 65.2872 642.465 65.6797C643.459 66.0722 644.31 66.3339 645.02 66.4647C645.729 66.5956 646.723 66.7264 648 66.8572V70.1281H647.858Z"
        fill={fillColor}
      />
    </svg>
  );
}
