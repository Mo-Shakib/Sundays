import React, { useState } from 'react';
import { X, Clock, Users, Calendar, ChevronDown } from 'lucide-react';

interface ScheduleModalProps {
  selectedDate: Date;
  onSave: (scheduleItem: any) => void;
  onClose: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ selectedDate, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    startTime: { hour: '10', minute: '00', period: 'AM' },
    endTime: { hour: '11', minute: '00', period: 'AM' },
    type: 'meeting' as 'meeting' | 'task',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate options for dropdowns
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const periods = ['AM', 'PM'];

  // Convert custom time format to 24-hour format
  const convertToTimeString = (timeObj: { hour: string; minute: string; period: string }) => {
    let hour = parseInt(timeObj.hour);
    if (timeObj.period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (timeObj.period === 'AM' && hour === 12) {
      hour = 0;
    }
    return `${hour.toString().padStart(2, '0')}:${timeObj.minute}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.startTime.hour || !formData.endTime.hour) {
      alert('Please fill in all required fields');
      return;
    }

    const startTimeString = convertToTimeString(formData.startTime);
    const endTimeString = convertToTimeString(formData.endTime);

    // Validate end time is after start time
    if (endTimeString <= startTimeString) {
      alert('End time must be after start time');
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduleItem = {
        title: formData.title,
        startTime: startTimeString,
        endTime: endTimeString,
        type: formData.type,
        description: formData.description
      };

      await onSave(scheduleItem);
    } catch (error) {
      console.error('Error saving schedule item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStartTime = (field: string, value: string) => {
    setFormData({
      ...formData,
      startTime: { ...formData.startTime, [field]: value }
    });
  };

  const updateEndTime = (field: string, value: string) => {
    setFormData({
      ...formData,
      endTime: { ...formData.endTime, [field]: value }
    });
  };

  const TimeSelector = ({ 
    time, 
    onTimeChange, 
    label, 
    disabled 
  }: { 
    time: { hour: string; minute: string; period: string }; 
    onTimeChange: (field: string, value: string) => void;
    label: string;
    disabled: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} *
      </label>
      <div className="flex space-x-2">
        {/* Hour Selector */}
        <div className="relative flex-1">
          <select
            value={time.hour}
            onChange={(e) => onTimeChange('hour', e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white disabled:opacity-50"
          >
            {hours.map(hour => (
              <option key={hour} value={hour}>{hour}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <span className="flex items-end pb-2 text-gray-500 font-medium">:</span>

        {/* Minute Selector */}
        <div className="relative flex-1">
          <select
            value={time.minute}
            onChange={(e) => onTimeChange('minute', e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white disabled:opacity-50"
          >
            {minutes.filter((_, i) => i % 15 === 0).map(minute => (
              <option key={minute} value={minute}>{minute}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* AM/PM Selector */}
        <div className="relative">
          <select
            value={time.period}
            onChange={(e) => onTimeChange('period', e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white disabled:opacity-50 min-w-[70px]"
          >
            {periods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );

  // Quick time preset buttons
  const timePresets = [
    { label: '30 min', duration: 30 },
    { label: '1 hour', duration: 60 },
    { label: '1.5 hours', duration: 90 },
    { label: '2 hours', duration: 120 }
  ];

  const setQuickDuration = (minutes: number) => {
    const startHour = parseInt(formData.startTime.hour);
    const startMinute = parseInt(formData.startTime.minute);
    const startPeriod = formData.startTime.period;

    // Convert to 24-hour format for calculation
    let start24Hour = startHour;
    if (startPeriod === 'PM' && startHour !== 12) start24Hour += 12;
    if (startPeriod === 'AM' && startHour === 12) start24Hour = 0;

    const startTotalMinutes = start24Hour * 60 + startMinute;
    const endTotalMinutes = startTotalMinutes + minutes;

    const endHour24 = Math.floor(endTotalMinutes / 60) % 24;
    const endMinute = endTotalMinutes % 60;

    // Convert back to 12-hour format
    let endHour = endHour24;
    let endPeriod = 'AM';
    
    if (endHour24 === 0) {
      endHour = 12;
    } else if (endHour24 > 12) {
      endHour = endHour24 - 12;
      endPeriod = 'PM';
    } else if (endHour24 === 12) {
      endPeriod = 'PM';
    }

    setFormData({
      ...formData,
      endTime: {
        hour: endHour.toString().padStart(2, '0'),
        minute: endMinute.toString().padStart(2, '0'),
        period: endPeriod
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Schedule Item</h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter event title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'meeting' })}
                disabled={isSubmitting}
                className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  formData.type === 'meeting'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                } disabled:opacity-50`}
              >
                <Users className="w-4 h-4 mx-auto mb-1" />
                Meeting
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'task' })}
                disabled={isSubmitting}
                className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                  formData.type === 'task'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                } disabled:opacity-50`}
              >
                <Calendar className="w-4 h-4 mx-auto mb-1" />
                Task
              </button>
            </div>
          </div>

          {/* Time Selectors */}
          <div className="space-y-4">
            <TimeSelector
              time={formData.startTime}
              onTimeChange={updateStartTime}
              label="Start Time"
              disabled={isSubmitting}
            />

            <TimeSelector
              time={formData.endTime}
              onTimeChange={updateEndTime}
              label="End Time"
              disabled={isSubmitting}
            />

            {/* Quick Duration Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Duration
              </label>
              <div className="grid grid-cols-2 gap-2">
                {timePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setQuickDuration(preset.duration)}
                    disabled={isSubmitting}
                    className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Click to automatically set end time based on start time
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add a description (optional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;