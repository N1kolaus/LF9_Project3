import { useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import { css } from "@emotion/react";

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    text-align: center;
`;

const LoadingSpinner = (props) => {
    const isLoading = props.isLoading;
    const [loading] = useState(isLoading);
    const [color] = useState("#77002E");

    return (
        <SyncLoader color={color} loading={loading} size={15} css={override} />
    );
};

export default LoadingSpinner;
