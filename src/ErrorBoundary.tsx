import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 border border-error/20">
            <span className="text-2xl text-error">!</span>
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-text-primary mb-1">
              Something went wrong
            </h2>
            <p className="text-xs font-mono text-text-muted max-w-sm break-all">
              {this.state.error.message}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg border border-border px-4 py-2 text-sm text-text-muted hover:text-text-primary hover:border-border-bright transition-colors duration-150"
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
