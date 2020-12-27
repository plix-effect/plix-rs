import React, {FC} from "react"
import {MenuItem, Select} from "@material-ui/core";
import {usePlixFiles} from "../../use/socket/usePlixFiles";

interface PlixFileSelectorProps {
    file: string,
    onChange: (file: string) => void
}

export const PlixFileSelector: FC<PlixFileSelectorProps> = ({file, onChange}) => {

    const [files] = usePlixFiles()

    const handleChange = (event) => {
        const val = event.target.value;
        onChange(val);
    };

    return (
        <Select
            value={file || ""}
            onChange={handleChange}
            displayEmpty={true}
            inputProps={{
                name: 'age',
                id: 'age-native-simple',
            }}
        >
            {
                files.map(file => (
                    <MenuItem value={file} key={file}>{file}</MenuItem>
                ))
            }
        </Select>
    )
}