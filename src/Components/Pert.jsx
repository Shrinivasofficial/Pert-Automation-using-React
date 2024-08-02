import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Network } from 'vis-network/standalone/umd/vis-network.min';
import { toPng } from 'html-to-image';

export default function Pert() {
  const [numTasks, setNumTasks] = useState(1);
  const [tasks, setTasks] = useState([{ optimistic: '', mostLikely: '', pessimistic: '', predecessors: '' }]);
  const [calculatedTasks, setCalculatedTasks] = useState([]);
  const [criticalPath, setCriticalPath] = useState([]);
  const [criticalPathDuration, setCriticalPathDuration] = useState(0);
  const graphContainerRef = useRef(null);
  const networkRef = useRef(null);

  const calculateDuration = (optimistic, mostLikely, pessimistic) => {
    return (parseFloat(optimistic) + 4 * parseFloat(mostLikely) + parseFloat(pessimistic)) / 6;
  };

  const calculateForwardBackwardPass = useCallback(() => {
    const newTasks = tasks.map((task, index) => {
      const duration = calculateDuration(task.optimistic, task.mostLikely, task.pessimistic);
      return {
        ...task,
        index,
        duration,
        ES: 0,
        EF: 0,
        LS: 0,
        LF: 0,
        slack: 0,
      };
    });

    // Forward pass
    newTasks.forEach((task, index) => {
      if (task.predecessors) {
        const predecessorIndices = task.predecessors.split(',').map((p) => parseInt(p.trim(), 10) - 1);
        const maxEF = Math.max(...predecessorIndices.map((i) => newTasks[i]?.EF || 0));
        task.ES = maxEF;
        task.EF = task.ES + task.duration;
      } else {
        task.ES = 0;
        task.EF = task.duration;
      }
    });

    // Backward pass
    const lastTask = newTasks.reduce((max, task) => (task.EF > max.EF ? task : max), newTasks[0]);
    const projectDuration = lastTask.EF;

    newTasks.reverse().forEach((task) => {
      const successorTasks = newTasks.filter((t) => t.predecessors.split(',').map((p) => parseInt(p.trim(), 10)).includes(task.index + 1));
      if (successorTasks.length > 0) {
        task.LF = Math.min(...successorTasks.map((t) => t.LS));
      } else {
        task.LF = projectDuration;
      }
      task.LS = task.LF - task.duration;
      task.slack = task.LS - task.ES;
    });

    newTasks.reverse();
    setCalculatedTasks(newTasks);
    const criticalPathTasks = newTasks.filter((task) => task.slack === 0);
    setCriticalPath(criticalPathTasks.map((task) => task.index + 1));
    setCriticalPathDuration(projectDuration);
  }, [tasks]);

  useEffect(() => {
    calculateForwardBackwardPass();
  }, [calculateForwardBackwardPass]);

  const generateGraph = useCallback(() => {
    if (networkRef.current) {
      networkRef.current.destroy();
    }

    const nodes = calculatedTasks.map((task) => ({
      id: task.index + 1,
      label: `Task ${task.index + 1}`,
      title: `Duration: ${task.duration.toFixed(2)}\nES: ${task.ES}\nEF: ${task.EF}\nLS: ${task.LS}\nLF: ${task.LF}\nSlack: ${task.slack}`,
      color: criticalPath.includes(task.index + 1) ? 'red' : 'lightblue',
    }));

    const edges = calculatedTasks
      .flatMap((task) => {
        if (task.predecessors) {
          const predecessorIndices = task.predecessors.split(',').map((p) => parseInt(p.trim(), 10));
          return predecessorIndices.map((predecessorIndex) => ({
            from: predecessorIndex,
            to: task.index + 1,
            color: criticalPath.includes(task.index + 1) && criticalPath.includes(predecessorIndex) ? 'red' : 'black',
          }));
        }
        return [];
      });

    // Ensure Task 1 is connected to all tasks that do not have predecessors
    const additionalEdges = calculatedTasks
      .filter((task) => !task.predecessors && task.index !== 0)
      .map((task) => ({
        from: 1,
        to: task.index + 1,
        color: 'black',
      }));

    const data = {
      nodes,
      edges: [...edges, ...additionalEdges],
    };

    const options = {
      layout: {
        hierarchical: {
          direction: 'UD',
          sortMethod: 'directed',
        },
      },
      nodes: {
        shape: 'box',
      },
      edges: {
        arrows: {
          to: {
            enabled: true,
          },
        },
      },
      interaction: { dragNodes: true },
    };

    networkRef.current = new Network(graphContainerRef.current, data, options);
  }, [calculatedTasks, criticalPath]);

  useEffect(() => {
    if (graphContainerRef.current) {
      generateGraph();
    }
  }, [generateGraph]);

  const handleNumTasksChange = (e) => {
    const newNumTasks = parseInt(e.target.value, 10);
    setNumTasks(newNumTasks);

    if (newNumTasks > tasks.length) {
      const newTasks = [...tasks];
      for (let i = tasks.length; i < newNumTasks; i++) {
        newTasks.push({ optimistic: '', mostLikely: '', pessimistic: '', predecessors: '' });
      }
      setTasks(newTasks);
    } else {
      setTasks(tasks.slice(0, newNumTasks));
    }
  };

  const handleTaskChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const handleDownloadClick = async () => {
    if (graphContainerRef.current) {
      try {
        const dataUrl = await toPng(graphContainerRef.current);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'pert-graph.png';
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  return (
    <div className='container mx-auto mt-16 px-4'>
      <h2 className='text-4xl font-extrabold'>PERT Automation</h2>
      <div className='mb-6'>
        <label htmlFor='projectName' className='block mb-2 mt-5 text-sm font-medium text-gray-900'>
          Title of the Project
        </label>
        <input
          type='text'
          className='block w-full mt-4 p-4 text-gray-900 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500'
          required
        />

        <label htmlFor='numTasks' className='block mb-2 mt-5 text-sm font-medium text-gray-900'>
          Number of tasks
        </label>
        <input
          type='number'
          value={numTasks}
          onChange={handleNumTasksChange}
          className='block w-full mt-4 p-4 text-gray-900 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500'
          required
          min='1'
        />

        {Array.from({ length: numTasks }, (_, index) => (
          <div key={index} className='flex flex-wrap -mx-2 mt-5'>
            <div className='w-full sm:w-1/4 px-2 mb-4'>
              <label htmlFor={`optimistic-${index}`} className='block mb-2 text-sm font-medium text-gray-900'>
                Optimistic Value (Task {index + 1})
              </label>
              <input
                type='number'
                value={tasks[index].optimistic}
                onChange={(e) => handleTaskChange(index, 'optimistic', e.target.value)}
                className='block w-full p-4 text-gray-900 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>

            <div className='w-full sm:w-1/4 px-2 mb-4'>
              <label htmlFor={`mostLikely-${index}`} className='block mb-2 text-sm font-medium text-gray-900'>
                Most Likely Value (Task {index + 1})
              </label>
              <input
                type='number'
                value={tasks[index].mostLikely}
                onChange={(e) => handleTaskChange(index, 'mostLikely', e.target.value)}
                className='block w-full p-4 text-gray-900 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>

            <div className='w-full sm:w-1/4 px-2 mb-4'>
              <label htmlFor={`pessimistic-${index}`} className='block mb-2 text-sm font-medium text-gray-900'>
                Pessimistic Value (Task {index + 1})
              </label>
              <input
                type='number'
                value={tasks[index].pessimistic}
                onChange={(e) => handleTaskChange(index, 'pessimistic', e.target.value)}
                className='block w-full p-4 text-gray-900 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>

            <div className='w-full sm:w-1/4 px-2 mb-4'>
              <label htmlFor={`predecessors-${index}`} className='block mb-2 text-sm font-medium text-gray-900'>
                Predecessors (Task {index + 1})
              </label>
              <input
                type='text'
                value={tasks[index].predecessors}
                onChange={(e) => handleTaskChange(index, 'predecessors', e.target.value)}
                className='block w-full p-4 text-gray-900 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500'
                placeholder='Enter predecessors as comma separated values'
              />
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className='text-2xl font-extrabold'>Task Details</h2>
        <div className='relative overflow-x-auto mt-8 shadow-md sm:rounded-lg'>
          <table className='w-full text-sm text-left text-gray-700'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Task
                </th>
                <th scope='col' className='px-6 py-3'>
                  Optimistic
                </th>
                <th scope='col' className='px-6 py-3'>
                  Most Likely
                </th>
                <th scope='col' className='px-6 py-3'>
                  Pessimistic
                </th>
                <th scope='col' className='px-6 py-3'>
                  Predecessors
                </th>
                <th scope='col' className='px-6 py-3'>
                  Duration
                </th>
                <th scope='col' className='px-6 py-3'>
                  ES
                </th>
                <th scope='col' className='px-6 py-3'>
                  EF
                </th>
                <th scope='col' className='px-6 py-3'>
                  LS
                </th>
                <th scope='col' className='px-6 py-3'>
                  LF
                </th>
                <th scope='col' className='px-6 py-3'>
                  Slack
                </th>
              </tr>
            </thead>
            <tbody>
              {calculatedTasks.map((task, index) => (
                <tr key={index} className='bg-white border-b'>
                  <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                    Task {index + 1}
                  </th>
                  <td className='px-6 py-4'>{task.optimistic}</td>
                  <td className='px-6 py-4'>{task.mostLikely}</td>
                  <td className='px-6 py-4'>{task.pessimistic}</td>
                  <td className='px-6 py-4'>{task.predecessors}</td>
                  <td className='px-6 py-4'>{task.duration.toFixed(2)}</td>
                  <td className='px-6 py-4'>{task.ES}</td>
                  <td className='px-6 py-4'>{task.EF}</td>
                  <td className='px-6 py-4'>{task.LS}</td>
                  <td className='px-6 py-4'>{task.LF}</td>
                  <td className='px-6 py-4'>{task.slack}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div ref={graphContainerRef} style={{ height: '400px', border: '1px solid black', marginTop: '20px' }}></div>

        <button
          onClick={handleDownloadClick}
          className='mt-4 px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600'
        >
          Download Graph
        </button>

        <div className='mt-8'>
          <h3 className='text-2xl font-bold'>Critical Path Details</h3>
          <p className='mt-2'>Nodes of Critical Path: {criticalPath.join(', ')}</p>
          <p className='mt-2'>Duration to Complete Critical Path: {criticalPathDuration.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
