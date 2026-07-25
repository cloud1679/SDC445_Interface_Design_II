import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Horse Manager recovered from an unexpected error.', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main role="alert">
          <h1>Horse Manager</h1>
          <p>Something unexpected happened. Your browser can safely reload the app.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload Horse Manager
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
