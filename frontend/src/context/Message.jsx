import { useReducer, createContext, useEffect } from 'react';
export const MessageContext = createContext();
const reducerFn = (state, action) => {
	switch (action.type) {
		case 'ADD_MESSAGE':
			return {
				messages: [...state.messages, action.payload],
			};
		case 'SET_MESSAGES':
			return {
				messages: action.payload,
			};
	}
};
export const MessageContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducerFn, {
		messages: [],
	});
	useEffect(() => {
		const getAllUserMessage = async () => {
			try {
				const response = await fetch(
					'http://localhost:8001/api/v1/message/messages',
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${JSON.parse(
								localStorage.getItem('token'),
							)}`,
						},
					},
				);
				const json = await response.json();
				dispatch({ type: 'SET_MESSAGES', payload: json.messages });
			} catch (error) {
				console.log('Error in getting all user messages', error);
			}
		};
		getAllUserMessage();
	}, []);

	return (
		<MessageContext.Provider value={{ ...state, dispatch }}>
			{children}
		</MessageContext.Provider>
	);
};
export default MessageContextProvider;