import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle, Sparkles } from 'lucide-react';

const FinalOutput = ({ onDownloadReport, currentTask }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownloadReport();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="card bg-gradient-to-br from-green-50 to-blue-50 border-green-200"
    >
      <div className="text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-800 mb-4"
        >
          Task Completed Successfully! 🎉
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
        >
          Your task has been completed by our AI agents. A comprehensive report has been generated 
          with research findings, analysis, visualizations, and recommendations.
        </motion.p>

        {/* Task Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Task Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-nova-blue-600 mb-1">🔍</div>
              <div className="font-medium text-gray-800">Research</div>
              <div className="text-gray-600">5 sources analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-athena-purple-600 mb-1">🧠</div>
              <div className="font-medium text-gray-800">Analysis</div>
              <div className="text-gray-600">6 insights identified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pixel-orange-600 mb-1">📊</div>
              <div className="font-medium text-gray-800">Visualizations</div>
              <div className="text-gray-600">8 charts created</div>
            </div>
          </div>
        </motion.div>

        {/* Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Comprehensive PDF Report Ready</span>
          </div>

          <motion.button
            onClick={handleDownload}
            disabled={isDownloading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`btn-primary text-lg px-8 py-4 flex items-center space-x-3 mx-auto ${
              downloadSuccess ? 'bg-green-600 hover:bg-green-700' : ''
            }`}
          >
            {isDownloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Report...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Download Complete!</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download PDF Report</span>
              </>
            )}
          </motion.button>

          {downloadSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-green-600 font-medium"
            >
              ✓ Report downloaded successfully!
            </motion.div>
          )}
        </motion.div>

        {/* Report Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Sparkles className="w-4 h-4 text-nova-blue-500 mr-2" />
              Report Contents
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Executive Summary</li>
              <li>• Research Findings</li>
              <li>• Analysis Results</li>
              <li>• Recommendations</li>
              <li>• Implementation Plan</li>
              <li>• Risk Assessment</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Sparkles className="w-4 h-4 text-athena-purple-500 mr-2" />
              Key Deliverables
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Professional PDF Format</li>
              <li>• Data Visualizations</li>
              <li>• Actionable Insights</li>
              <li>• Success Metrics</li>
              <li>• Timeline & Milestones</li>
              <li>• Next Steps</li>
            </ul>
          </div>
        </motion.div>

        {/* Task Details */}
        {currentTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <div className="text-sm text-gray-600">
              <p><strong>Task:</strong> {currentTask.description}</p>
              <p><strong>Task ID:</strong> {currentTask.id}</p>
              <p><strong>Completed:</strong> {new Date().toLocaleString()}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FinalOutput;
