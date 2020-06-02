import {DocumentActions, DocumentActionTypes} from '@app/pages/transfer-pw/state/documents.actions';
import {TransferState} from '@app/pages/transfer-pw/state/index';



const initialState: TransferState = {
  documents: [],
  error: ''
};

export function transferDocReducer(state = initialState, action: DocumentActions): TransferState {
  switch (action.type) {
    case DocumentActionTypes.LoadSuccess:
      return {
        ...state,
        documents: action.payload,
        error: ''
      };
    case DocumentActionTypes.LoadFail:
      return {
        ...state,
        documents: [],
        error: action.payload
      };
    case DocumentActionTypes.CreateSuccess:
      return {
        ...state,
        documents: [...state.documents, action.payload],
        error: ''
      };
    case DocumentActionTypes.CreateFail:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}
