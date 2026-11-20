import { useState } from 'react';
import './App.css';

function App() {
  // Retry configuration states
  const [strategy, setStrategy] = useState('exponential');
  const [maxRetries, setMaxRetries] = useState('4');
  const [initialDelay, setInitialDelay] = useState('1000');
  const [maxDelay, setMaxDelay] = useState('5000');
  const [jitterEnabled, setJitterEnabled] = useState(false);
  const [simulatedFailures, setSimulatedFailures] = useState('3');

  // Simulation states
  const [attempts, setAttempts] = useState([]);
  const [status, setStatus] = useState('idle');
  const [isRunning, setIsRunning] = useState(false);

  // Input validation errors
  const [errors, setErrors] = useState({});

  // Validate all configuration inputs
  const validateInputs = () => {
    const newErrors = {};

    const failures = Number(simulatedFailures);
    const retries = Number(maxRetries);
    const initial = Number(initialDelay);
    const maximum = Number(maxDelay);

    if (
      simulatedFailures.trim() === '' ||
      !Number.isInteger(failures) ||
      failures < 0 ||
      failures > 10
    ) {
      newErrors.simulatedFailures =
        'Simulated failures must be between 0 and 10.';
    }

    if (
      maxRetries.trim() === '' ||
      !Number.isInteger(retries) ||
      retries < 1 ||
      retries > 10
    ) {
      newErrors.maxRetries =
        'Maximum retries must be between 1 and 10.';
    }

    if (
      initialDelay.trim() === '' ||
      !Number.isFinite(initial) ||
      initial < 100 ||
      initial > 10000
    ) {
      newErrors.initialDelay =
        'Initial delay must be between 100 and 10000 ms.';
    }

    if (
      maxDelay.trim() === '' ||
      !Number.isFinite(maximum) ||
      maximum < 100 ||
      maximum > 30000
    ) {
      newErrors.maxDelay =
        'Maximum delay must be between 100 and 30000 ms.';
    } else if (
      initialDelay.trim() !== '' &&
      Number.isFinite(initial) &&
      initial >= 100 &&
      initial <= 10000 &&
      maximum < initial
    ) {
      newErrors.maxDelay =
        'Maximum delay must be greater than or equal to initial delay.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Utility function to create delay
  const wait = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Calculate delay based on selected retry strategy
  const calculateBaseDelay = (retryNumber) => {
    const initial = Number(initialDelay);
    const maximum = Number(maxDelay);

    const calculatedDelay =
      strategy === 'exponential'
        ? initial * Math.pow(2, retryNumber - 1)
        : initial;

    return Math.min(calculatedDelay, maximum);
  };

  // Apply Jitter to the calculated retry delay
  const calculateRetryDelay = (retryNumber) => {
    const baseDelay = calculateBaseDelay(retryNumber);

    return jitterEnabled
      ? Math.floor(Math.random() * (baseDelay + 1))
      : baseDelay;
  };

  // Simulated API request
  const mockApiCall = async (attempt) => {
    await wait(300);

    if (attempt <= Number(simulatedFailures)) {
      throw new Error('503 - Service Temporarily Unavailable');
    }

    return {
      message: 'API request successful!',
    };
  };

  // Main retry logic
  const handleSimulation = async () => {
    if (isRunning) return;

    // Stop simulation if configuration is invalid
    if (!validateInputs()) return;

    setIsRunning(true);
    setStatus('running');
    setAttempts([]);

    try {
      // Attempt 1 is the initial request.
      // Remaining attempts are retries.
      for (
        let attempt = 1;
        attempt <= Number(maxRetries) + 1;
        attempt++
      ) {
        const newAttempt = {
          number: attempt,
          status: 'pending',
          delay: 0,
          baseDelay: 0,
          jitterApplied: false,
          message: 'Request in progress...',
        };

        setAttempts((prev) => [...prev, newAttempt]);

        try {
          const response = await mockApiCall(attempt);

          setAttempts((prev) =>
            prev.map((item) =>
              item.number === attempt
                ? {
                    ...item,
                    status: 'success',
                    message: response.message,
                  }
                : item
            )
          );

          setStatus('success');
          break;
        } catch (error) {
          const canRetry = attempt <= Number(maxRetries);

          // No retries remaining
          if (!canRetry) {
            setAttempts((prev) =>
              prev.map((item) =>
                item.number === attempt
                  ? {
                      ...item,
                      status: 'failed',
                      message: error.message,
                    }
                  : item
              )
            );

            setStatus('failed');
            break;
          }

          // Calculate base delay and actual retry delay
          const baseDelay = calculateBaseDelay(attempt);
          const delay = calculateRetryDelay(attempt);

          setAttempts((prev) =>
            prev.map((item) =>
              item.number === attempt
                ? {
                    ...item,
                    status: 'failed',
                    delay,
                    baseDelay,
                    jitterApplied: jitterEnabled,
                    message: error.message,
                  }
                : item
            )
          );

          // Wait before making the next retry
          await wait(delay);
        }
      }
    } finally {
      setIsRunning(false);
    }
  };

  // Reset simulation
  const handleReset = () => {
    setAttempts([]);
    setStatus('idle');
  };

  // Generate deterministic retry intervals for preview
  // Do not use Math.random() during rendering.
  const retryIntervals = Array.from(
    { length: Math.min(Number(maxRetries) || 0, 4) },
    (_, index) => calculateBaseDelay(index + 1)
  );

  return (
    <div className="app-container">

      {/* Header */}
      <header className="header">
        <div>
          <h1>API Retry Simulator</h1>
          <p>
            Understand retry strategies through interactive experiments.
          </p>
        </div>

        <span className="status-badge">
          ● {isRunning ? 'Running' : 'System Ready'}
        </span>
      </header>

      <main>

        {/* Retry Configuration */}
        <section className="config-section">
          <h2>Retry Configuration</h2>

          <div className="config-grid">

            {/* Retry Strategy */}
            <div className="config-card">
              <label htmlFor="strategy">Retry Strategy</label>

              <select
                id="strategy"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                disabled={isRunning}
              >
                <option value="exponential">
                  Exponential Backoff
                </option>

                <option value="fixed">
                  Fixed Retry
                </option>
              </select>
            </div>

            {/* Maximum Retries */}
            <div className="config-card">
              <label htmlFor="maxRetries">Maximum Retries</label>

              <input
                id="maxRetries"
                type="number"
                min="1"
                max="10"
                step="1"
                value={maxRetries}
                disabled={isRunning}
                aria-invalid={Boolean(errors.maxRetries)}
                onChange={(e) => {
                  setMaxRetries(e.target.value);
                  setErrors({});
                }}
                onBlur={validateInputs}
              />

              {errors.maxRetries && (
                <small className="input-error">
                  {errors.maxRetries}
                </small>
              )}
            </div>

            {/* Simulated Failures */}
            <div className="config-card">
              <label htmlFor="simulatedFailures">
                Simulated Failures
              </label>

              <input
                id="simulatedFailures"
                type="number"
                min="0"
                max="10"
                step="1"
                value={simulatedFailures}
                disabled={isRunning}
                aria-invalid={Boolean(errors.simulatedFailures)}
                onChange={(e) => {
                  setSimulatedFailures(e.target.value);
                  setErrors({});
                }}
                onBlur={validateInputs}
              />

              {errors.simulatedFailures && (
                <small className="input-error">
                  {errors.simulatedFailures}
                </small>
              )}
            </div>

            {/* Initial Delay */}
            <div className="config-card">
              <label htmlFor="initialDelay">
                Initial Delay (ms)
              </label>

              <input
                id="initialDelay"
                type="number"
                min="100"
                max="10000"
                step="100"
                value={initialDelay}
                disabled={isRunning}
                aria-invalid={Boolean(errors.initialDelay)}
                onChange={(e) => {
                  setInitialDelay(e.target.value);
                  setErrors({});
                }}
                onBlur={validateInputs}
              />

              {errors.initialDelay && (
                <small className="input-error">
                  {errors.initialDelay}
                </small>
              )}
            </div>

            {/* Maximum Delay */}
            <div className="config-card">
              <label htmlFor="maxDelay">
                Maximum Delay (ms)
              </label>

              <input
                id="maxDelay"
                type="number"
                min="100"
                max="30000"
                step="100"
                value={maxDelay}
                disabled={isRunning}
                aria-invalid={Boolean(errors.maxDelay)}
                onChange={(e) => {
                  setMaxDelay(e.target.value);
                  setErrors({});
                }}
                onBlur={validateInputs}
              />

              {errors.maxDelay && (
                <small className="input-error">
                  {errors.maxDelay}
                </small>
              )}
            </div>

            {/* Jitter Toggle */}
            <div className="config-card jitter-card">
              <div className="jitter-content">
                <div>
                  <label htmlFor="enableJitter">
                    Enable Jitter
                  </label>

                  <small>
                    Randomizes retry delays to avoid synchronized requests.
                  </small>
                </div>

                <input
                  id="enableJitter"
                  className="jitter-checkbox"
                  type="checkbox"
                  checked={jitterEnabled}
                  onChange={(e) =>
                    setJitterEnabled(e.target.checked)
                  }
                  disabled={isRunning}
                />
              </div>
            </div>

          </div>

          <button
            className="simulate-btn"
            onClick={handleSimulation}
            disabled={isRunning}
          >
            {isRunning ? 'Simulating...' : 'Simulate API Request'}
          </button>

          <button
            className="reset-btn"
            onClick={handleReset}
            disabled={isRunning}
          >
            Reset
          </button>

        </section>

        {/* Request Timeline */}
        <section className="results-section">

          <div className="section-heading">
            <h2>Request Timeline</h2>

            <span>
              {attempts.length} Attempts
            </span>
          </div>

          {attempts.length === 0 ? (

            <div className="empty-state">
              <div className="empty-icon">↻</div>

              <h3>No requests yet</h3>

              <p>
                Run a simulation to visualize API retries
                and increasing delay intervals.
              </p>
            </div>

          ) : (

            <div className="attempt-list">

              {attempts.map((attempt) => (

                <div
                  className={`attempt-card ${attempt.status}`}
                  key={attempt.number}
                >

                  <div>
                    <h3>Attempt #{attempt.number}</h3>
                    <p>{attempt.message}</p>
                  </div>

                  <div className="attempt-details">

                    <span>
                      {attempt.status === 'success'
                        ? '✅ Success'
                        : attempt.status === 'failed'
                          ? '❌ Failed'
                          : '⏳ Pending'}
                    </span>

                    {attempt.delay > 0 && (
                      <small>
                        Retry after {(attempt.delay / 1000).toFixed(2)}s

                        {attempt.jitterApplied && (
                          <>
                            {' '}
                            (Base: {(attempt.baseDelay / 1000).toFixed(2)}s)
                          </>
                        )}
                      </small>
                    )}

                    {attempt.jitterApplied && attempt.delay === 0 && (
                      <small>
                        Jitter selected a 0ms delay
                      </small>
                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

          {status === 'success' && (
            <div className="final-status success-message">
              🎉 Request completed successfully!
            </div>
          )}

          {status === 'failed' && (
            <div className="final-status error-message">
              ❌ Maximum retries reached. Request failed.
            </div>
          )}

        </section>

        {/* Retry Strategy Explanation */}
        <section className="info-section">

          <h2>
            {strategy === 'exponential'
              ? 'How Exponential Backoff Works'
              : 'How Fixed Retry Works'}
          </h2>

          <p>
            {strategy === 'exponential'
              ? 'Exponential Backoff progressively increases the waiting time between consecutive failed requests.'
              : 'Fixed Retry uses the same waiting time after every failed request.'}
          </p>

          <div className="formula">
            {strategy === 'exponential'
              ? 'Delay = Initial Delay × 2ⁿ'
              : 'Delay = Initial Delay'}
          </div>

          <p className="delay-caption">
            {jitterEnabled
              ? 'Full Jitter selects a random delay between 0 and each calculated interval.'
              : 'Retry intervals based on your current configuration.'}
          </p>

          <div className="delay-flow">

            {retryIntervals.map((delay, index) => (

              <div className="delay-step" key={index}>

                <span className="delay-label">
                  {jitterEnabled
                    ? `0–${(delay / 1000).toFixed(1)} sec`
                    : `${(delay / 1000).toFixed(1)} sec`}
                </span>

                {index !== retryIntervals.length - 1 && (
                  <span className="delay-arrow">→</span>
                )}

              </div>

            ))}

          </div>

        </section>

      </main>

      <footer>
        Built with React.js | Code Beyond Code #01
      </footer>

    </div>
  );
}

export default App;