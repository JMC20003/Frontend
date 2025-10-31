import { http } from "./api";


export const upDateTable = async(layerID,globalId,editeData, schema, bbox)=>{

    try {
        return await http.patch(`/table/update-field`, {
            globalId,
            editeData,
            layerID,
            schema,
            bbox
        },{
            headers: {
                'Content-Type': 'application/json',
            },
            
        })
    } catch (error) {
        console.log(error);
    }
}

export const getAllTables = async() => {
    try {
        return await http.get(`/table/get-all`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.log(error);
    }
}


export const createTableData = async (tableName, schema,bbox,pk, data) => {
    try {
        return await http.post(`/table/create`, {
            layerID: tableName,
            schema,
            pk,
            data,
            bbox
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error creating table data:", error);
    }
}


export const deleteTableData = async (layerID, schema, bbox, id_layer) => {
    try {
        return await http.delete(`/table/delete`, {
            data: {
                layerID,
                schema,
                bbox,
                id_layer
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error deleting table data:", error);
    }
}

export const getTableDataById = async (layerID, schema, field, id)=>{
    try {
        return await http.get(`/table/get-by-id`, {
            params: {
                layerID,
                schema,
                field,
                id
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.log("Error fetching table data by ID:", error);
        return error.response.data.message
    }


}
export const saveTextData = async (layerID, schema, pk, data) => {
    try {
        return await http.post(`/table/create-text-data`, {
            layerID,
            schema,
            pk,
            data
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.log("Error saving text data:", error);
    }
}   

export const deleteTextData = async (layerID, schema, id) => {
    try {
        return await http.delete(`/table/delete-text-data`, {
            data: {
                layerID,
                schema,
                id
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.log("Error deleting text data:", error);
    }
}

export const updateTextData = async (layerID, schema, id, data) => {
    try {
        return await http.patch(`/table/update-field-text-data`, {
            layerID,
            schema,
            id,
            data
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.log("Error updating text data:", error);
    }
}

export const deleteTextDataODF = async (layerID, schema, data) => {
    try {
        return await http.delete(`/table/delete-data-odf`, {
            data: {
                layerID,
                schema,
                data
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.log("Error deleting text data ODF:", error);
    }
}
