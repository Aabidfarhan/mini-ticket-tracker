import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
// Assuming TicketList exists in src/components/ or similar. Replace path if necessary.
import TicketList from '../components/TicketList'; 

const mockStore = configureStore([]);

describe('TicketList UI', () => {
  it('renders a list of tickets correctly from the redux store', () => {
    const store = mockStore({
      tickets: {
        tickets: [
          { id: 1, title: 'Server Down', status: 'NEW' },
          { id: 2, title: 'Fix Layout', status: 'IN_PROGRESS' }
        ],
        status: "success"
      }
    });

    render(
      <Provider store={store}>
        <TicketList />
      </Provider>
    );

    // Verify tickets render
    expect(screen.getByText('Server Down')).toBeInTheDocument();
    expect(screen.getByText('Fix Layout')).toBeInTheDocument();
    
    // Status badges
    expect(screen.getByText('NEW')).toBeInTheDocument();
    expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument();
  });
});
