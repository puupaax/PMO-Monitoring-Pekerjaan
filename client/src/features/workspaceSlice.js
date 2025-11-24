import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../configs/api";

export const fetchWorkspaces = createAsyncThunk('workspace/fetchWorkspaces', async ({getToken}) => {
    try {
        const {data} = await api.get('/api/workspaces', {headers: {Authorization: `Bearer ${await getToken()}`}})
        return data.workspaces || []
    } catch (error) {
        console.log(error?.response?.data?.message || error.message )
        return []

    }

})

const initialState = {
    workspaces: [],
    currentWorkspace: null,
    loading: false,
};

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        addProject: () => {
            // sengaja dikosongkan karena projects sudah tidak digunakan
        },
        

    },
    extraReducers: (builder ) => {
        builder.addCase(fetchWorkspaces.pending, (state) => {
            state.loading = true
        });
        builder.addCase(fetchWorkspaces.fulfilled, (state, action) => {
            state.workspaces = action.payload;
            if(action.payload.length > 0){
                const localStorageCurrentWorkspaceId = localStorage.getItem("currentWorkspaceId");
                if(localStorageCurrentWorkspaceId){
                    const findWorkspace = action.payload.find((w) => w.id === localStorageCurrentWorkspaceId);
                    if(findWorkspace){
                        state.currentWorkspace = findWorkspace
                    }else{
                        state.currentWorkspace=action.payload[0]
                    }
                }else{
                    state.currentWorkspace=action.payload[0]
                }
            }
            state.loading = false;
        }); 
        builder.addCase(fetchWorkspaces.rejected, (state) => {
            state.loading = false
        });
    }
});

export const { setWorkspaces, setCurrentWorkspace, addWorkspace, updateWorkspace, deleteWorkspace, addProject, addTask, updateTask, deleteTask } = workspaceSlice.actions;
export default workspaceSlice.reducer;